#!/usr/bin/env python3
"""
Generate 25 fabricated "scanned document" JPEGs for the chaserAI landing-page
"Try an example" gallery — 5 documents for each of the 5 example queries.

Approach: render realistic HTML document templates with headless Google Chrome,
then post-process each screenshot with PIL to look like a phone/scanner capture
(slight rotation, off-white paper, faint blur + grain) and save as JPEG.

All company names, GSTINs, addresses and numbers are FICTITIOUS.

Usage:  python3 scripts/gen_samples.py
Output: public/samples/*.jpg   (committed; served as-is via static export)

Requires: Google Chrome (macOS) and Pillow (pip install Pillow) — both already
present on the dev machine.
"""

import os
import subprocess
import tempfile

from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "samples")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Deterministic per-document tilt so runs are reproducible.
TILTS = [-1.2, 0.8, -0.6, 1.1, -0.9]

OUR_CO = "Chaser Technologies Pvt Ltd"
OUR_ADDR = "No. 24, 3rd Floor, HSR Layout Sector 2, Bengaluru 560102"
OUR_GSTIN = "29AAFCC7391Q1ZR"


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def fmt_inr(n):
    """Indian-grouped rupee string, e.g. 1240800 -> '12,40,800'."""
    n = int(round(n))
    s = str(abs(n))
    if len(s) <= 3:
        grouped = s
    else:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        if head:
            parts.insert(0, head)
        grouped = ",".join(parts) + "," + tail
    return ("-" if n < 0 else "") + grouped


_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
         "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
         "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
         "Eighty", "Ninety"]


def _two(n):
    if n < 20:
        return _ONES[n]
    return (_TENS[n // 10] + (" " + _ONES[n % 10] if n % 10 else "")).strip()


def _three(n):
    h = n // 100
    r = n % 100
    out = ""
    if h:
        out = _ONES[h] + " Hundred"
        if r:
            out += " "
    if r:
        out += _two(r)
    return out


def num_to_words_inr(n):
    """Indian-system words for a rupee integer (up to 99,99,99,999)."""
    n = int(round(n))
    if n == 0:
        return "Zero Rupees Only"
    crore = n // 10000000
    n %= 10000000
    lakh = n // 100000
    n %= 100000
    thousand = n // 1000
    n %= 1000
    hundreds = n
    parts = []
    if crore:
        parts.append(_two(crore) + " Crore")
    if lakh:
        parts.append(_two(lakh) + " Lakh")
    if thousand:
        parts.append(_two(thousand) + " Thousand")
    if hundreds:
        parts.append(_three(hundreds))
    return " ".join(parts).strip() + " Rupees Only"


# --------------------------------------------------------------------------- #
# Shared styling
# --------------------------------------------------------------------------- #
CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #d8d8d4; }
  .page {
    width: 900px; min-height: 1300px; margin: 40px auto; background: #fdfdfb;
    padding: 46px 50px; color: #1a1a1a; position: relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    font-family: "Helvetica Neue", Arial, sans-serif; font-size: 14px;
  }
  .serif { font-family: Georgia, "Times New Roman", serif; }
  .mono  { font-family: "Courier New", monospace; }
  .muted { color: #555; }
  .right { text-align: right; }
  .center { text-align: center; }
  .row { display: flex; justify-content: space-between; }
  h1 { font-size: 26px; letter-spacing: 0.5px; }
  h2 { font-size: 18px; }
  .rule { border-top: 2px solid #222; margin: 14px 0; }
  .thin { border-top: 1px solid #bbb; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { padding: 8px 10px; text-align: left; font-size: 13px; }
  thead th { background: #f0efe9; border-top: 1.5px solid #333; border-bottom: 1.5px solid #333; }
  tbody td { border-bottom: 1px solid #ddd; }
  .num { text-align: right; font-family: "Courier New", monospace; white-space: nowrap; }
  .totbox { width: 320px; margin-left: auto; margin-top: 8px; }
  .totbox .row { padding: 5px 2px; font-size: 13px; }
  .totbox .grand { border-top: 2px solid #222; border-bottom: 2px solid #222;
    font-weight: bold; font-size: 15px; padding: 8px 2px; }
  .stamp { position: absolute; top: 44px; right: 50px; border: 2px solid #7a1f1f;
    color: #7a1f1f; font-weight: bold; padding: 4px 10px; transform: rotate(-8deg);
    font-family: Georgia, serif; letter-spacing: 1px; opacity: 0.85; font-size: 13px; }
  .pill { display: inline-block; border: 1px solid #333; border-radius: 3px;
    padding: 2px 8px; font-size: 11px; }
  .sign { margin-top: 60px; }
  .foot { position: absolute; bottom: 30px; left: 50px; right: 50px;
    font-size: 11px; color: #888; text-align: center; }
"""


def html(body):
    return (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<style>{CSS}</style></head><body>{body}</body></html>"
    )


def rupee(n):
    return "&#8377; " + fmt_inr(n)


# --------------------------------------------------------------------------- #
# Template 1 — GST Tax Invoice (Bengaluru supplier)
# --------------------------------------------------------------------------- #
def tpl_gst(d):
    rows = ""
    sub = 0
    for i, it in enumerate(d["items"], 1):
        amt = it["qty"] * it["rate"]
        sub += amt
        rows += (
            f"<tr><td>{i}</td><td>{it['desc']}</td><td class='mono'>{it['hsn']}</td>"
            f"<td class='num'>{it['qty']}</td><td class='num'>{fmt_inr(it['rate'])}</td>"
            f"<td class='num'>{fmt_inr(amt)}</td></tr>"
        )
    cgst = round(sub * 0.09)
    sgst = round(sub * 0.09)
    total = sub + cgst + sgst
    body = f"""
    <div class="page">
      <div class="stamp">PAID</div>
      <div class="row">
        <div>
          <h1 class="serif">{d['seller']}</h1>
          <div class="muted" style="margin-top:6px;max-width:420px">{d['addr']}</div>
          <div class="muted" style="margin-top:4px">Phone: {d['phone']} &nbsp;·&nbsp; {d['email']}</div>
          <div style="margin-top:6px"><b>GSTIN:</b> <span class="mono">{d['gstin']}</span></div>
        </div>
        <div class="right">
          <h2 class="serif">TAX INVOICE</h2>
          <div style="margin-top:10px"><b>Invoice No:</b> <span class="mono">{d['inv']}</span></div>
          <div><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted" style="margin-top:6px">Place of Supply: Karnataka (29)</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">BILL TO</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted" style="max-width:360px">{OUR_ADDR}</div>
          <div style="margin-top:4px"><b>GSTIN:</b> <span class="mono">{OUR_GSTIN}</span></div>
        </div>
        <div class="right muted">
          <div style="font-size:11px;letter-spacing:1px">PURCHASE ORDER</div>
          <div class="mono" style="margin-top:4px">{d['po']}</div>
          <div style="margin-top:4px">Terms: Net 30</div>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>HSN</th>
          <th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Taxable Value</span><span class="num">{rupee(sub)}</span></div>
        <div class="row"><span>CGST @ 9%</span><span class="num">{rupee(cgst)}</span></div>
        <div class="row"><span>SGST @ 9%</span><span class="num">{rupee(sgst)}</span></div>
        <div class="row grand"><span>Total</span><span class="num">{rupee(total)}</span></div>
      </div>
      <div style="margin-top:14px;font-size:12px"><b>Amount in words:</b>
        <span class="muted">{num_to_words_inr(total)}</span></div>
      <div class="row sign">
        <div class="muted" style="font-size:12px;max-width:360px">
          Goods once sold will not be taken back. Subject to Bengaluru jurisdiction.
        </div>
        <div class="right">
          <div style="height:44px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Authorised Signatory</div>
          <div>for {d['seller']}</div>
        </div>
      </div>
      <div class="foot">This is a computer-generated tax invoice.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 2 — BESCOM Electricity Bill
# --------------------------------------------------------------------------- #
def tpl_bescom(d):
    energy = round(d["units"] * 7.1)
    fixed = d["load"] * 110
    tax = round((energy + fixed) * 0.09)
    total = energy + fixed + tax
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 class="serif" style="color:#123f7a">BESCOM</h1>
          <div class="muted">Bangalore Electricity Supply Company Ltd</div>
          <div class="muted" style="font-size:12px">{d['subdiv']} Sub-Division</div>
        </div>
        <div class="right">
          <div class="pill">ELECTRICITY BILL</div>
          <div style="margin-top:8px"><b>Bill Month:</b> {d['month']}</div>
          <div class="muted">Bill No: <span class="mono">{d['billno']}</span></div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">CONSUMER</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted" style="max-width:360px">{d['site']}</div>
        </div>
        <div class="right">
          <div><b>RR No:</b> <span class="mono">{d['rr']}</span></div>
          <div><b>Account ID:</b> <span class="mono">{d['acct']}</span></div>
          <div class="muted">Tariff: LT-3 (Commercial)</div>
          <div class="muted">Sanctioned Load: {d['load']} kW</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th class="num">Reading / Value</th></tr></thead>
        <tbody>
          <tr><td>Billing Period</td><td class="num">{d['period']}</td></tr>
          <tr><td>Present Reading</td><td class="num">{d['pres']}</td></tr>
          <tr><td>Previous Reading</td><td class="num">{d['prev']}</td></tr>
          <tr><td>Units Consumed (kWh)</td><td class="num">{fmt_inr(d['units'])}</td></tr>
          <tr><td>Energy Charges @ &#8377;7.10/unit</td><td class="num">{rupee(energy)}</td></tr>
          <tr><td>Fixed Charges ({d['load']} kW)</td><td class="num">{rupee(fixed)}</td></tr>
          <tr><td>Electricity Tax &amp; Cess</td><td class="num">{rupee(tax)}</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row grand"><span>Net Amount Payable</span><span class="num">{rupee(total)}</span></div>
        <div class="row"><span class="muted">Due Date</span><span class="mono">{d['due']}</span></div>
      </div>
      <div style="margin-top:20px;font-size:12px" class="muted">
        Pay online at bescom.karnataka.gov.in or any authorised BangaloreOne centre.
        A late fee of 2% per month applies after the due date.
      </div>
      <div class="foot">BESCOM · Consumer Care 1912 · This is a system-generated bill.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 3 — Croma Retail Tax Invoice (laptop)
# --------------------------------------------------------------------------- #
def tpl_croma(d):
    taxable = round(d["price"] / 1.18)
    gst = d["price"] - taxable
    cgst = gst // 2
    sgst = gst - cgst
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 style="color:#0a9d58;letter-spacing:2px">croma</h1>
          <div class="muted" style="font-size:12px">A unit of Infiniti Retail Ltd</div>
          <div class="muted" style="font-size:12px;max-width:360px">{d['store']}</div>
          <div style="margin-top:4px;font-size:12px"><b>GSTIN:</b> <span class="mono">{d['gstin']}</span></div>
        </div>
        <div class="right">
          <div class="pill">RETAIL INVOICE</div>
          <div style="margin-top:8px"><b>Invoice:</b> <span class="mono">{d['inv']}</span></div>
          <div><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted">Cashier: {d['cashier']} · Till {d['till']}</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">CUSTOMER</div>
          <div style="margin-top:4px">{OUR_CO}</div>
          <div class="muted">GSTIN: <span class="mono">{OUR_GSTIN}</span></div>
        </div>
        <div class="right muted"><div>Payment: {d['pay']}</div><div>Approval: {d['appr']}</div></div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>HSN</th><th>Serial No.</th><th class="num">Amount</th></tr></thead>
        <tbody>
          <tr><td><b>{d['item']}</b></td><td class="mono">8471</td>
              <td class="mono">{d['serial']}</td><td class="num">{rupee(taxable)}</td></tr>
          <tr><td class="muted" colspan="3">Warranty: {d['warranty']}</td>
              <td class="num muted">incl.</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Taxable Value</span><span class="num">{rupee(taxable)}</span></div>
        <div class="row"><span>CGST @ 9%</span><span class="num">{rupee(cgst)}</span></div>
        <div class="row"><span>SGST @ 9%</span><span class="num">{rupee(sgst)}</span></div>
        <div class="row grand"><span>Total Paid</span><span class="num">{rupee(d['price'])}</span></div>
      </div>
      <div style="margin-top:14px;font-size:12px"><b>Amount in words:</b>
        <span class="muted">{num_to_words_inr(d['price'])}</span></div>
      <div style="margin-top:22px;font-size:12px" class="muted">
        Thank you for shopping at Croma. Returns accepted within 7 days with invoice and
        original packaging (opened electronics subject to inspection).
      </div>
      <div class="foot">Croma · shop.croma.com · Helpline 7207666000</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 4 — Outgoing Client Invoice (> Rs 5 lakh)
# --------------------------------------------------------------------------- #
def tpl_client(d):
    rows = ""
    sub = 0
    for it in d["items"]:
        sub += it["amt"]
        rows += (
            f"<tr><td>{it['desc']}</td><td class='num'>{fmt_inr(it['amt'])}</td></tr>"
        )
    igst = round(sub * 0.18)
    total = sub + igst
    body = f"""
    <div class="page">
      <div class="row">
        <div>
          <h1 class="serif">{OUR_CO}</h1>
          <div class="muted" style="max-width:380px;margin-top:6px">{OUR_ADDR}</div>
          <div style="margin-top:6px"><b>GSTIN:</b> <span class="mono">{OUR_GSTIN}</span></div>
          <div class="muted">CIN: U72900KA2023PTC167204</div>
        </div>
        <div class="right">
          <h2 class="serif">INVOICE</h2>
          <div style="margin-top:10px"><b>No:</b> <span class="mono">{d['inv']}</span></div>
          <div><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted" style="margin-top:4px">Due: {d['due']}</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">BILL TO</div>
          <div style="margin-top:4px"><b>{d['client']}</b></div>
          <div class="muted" style="max-width:360px">{d['client_addr']}</div>
          <div style="margin-top:4px"><b>GSTIN:</b> <span class="mono">{d['client_gstin']}</span></div>
        </div>
        <div class="right muted">
          <div style="font-size:11px;letter-spacing:1px">PROJECT</div>
          <div style="margin-top:4px">{d['project']}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description of Services</th><th class="num">Amount</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Subtotal</span><span class="num">{rupee(sub)}</span></div>
        <div class="row"><span>IGST @ 18%</span><span class="num">{rupee(igst)}</span></div>
        <div class="row grand"><span>Total Due</span><span class="num">{rupee(total)}</span></div>
      </div>
      <div style="margin-top:14px;font-size:12px"><b>Amount in words:</b>
        <span class="muted">{num_to_words_inr(total)}</span></div>
      <div class="thin" style="margin-top:26px"></div>
      <div class="row" style="font-size:12px;margin-top:8px">
        <div class="muted">
          <div style="font-size:11px;letter-spacing:1px;color:#333">REMIT TO</div>
          <div>HDFC Bank · A/c {d['acct']}</div>
          <div>IFSC HDFC0001284 · HSR Layout Branch</div>
        </div>
        <div class="right">
          <div style="height:40px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Authorised Signatory</div>
        </div>
      </div>
      <div class="foot">Thank you for your business. Payments net 15 days from invoice date.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 5 — Delhivery Consignment Note
# --------------------------------------------------------------------------- #
def tpl_delhivery(d):
    freight = d["freight"]
    fuel = round(freight * 0.12)
    gst = round((freight + fuel) * 0.18)
    total = freight + fuel + gst
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 style="color:#e01a4f;letter-spacing:1px">Delhivery</h1>
          <div class="muted" style="font-size:12px">Delhivery Ltd · Logistics &amp; Supply Chain</div>
          <div class="muted" style="font-size:12px">GSTIN: <span class="mono">{d['gstin']}</span></div>
        </div>
        <div class="right">
          <div class="pill">CONSIGNMENT NOTE</div>
          <div style="margin-top:8px"><b>AWB:</b> <span class="mono" style="font-size:16px">{d['awb']}</span></div>
          <div class="muted">Date: <span class="mono">{d['date']}</span></div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div style="width:48%">
          <div class="muted" style="font-size:11px;letter-spacing:1px">SHIPPER</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted">{d['origin_addr']}</div>
          <div class="muted">Origin: <b>{d['origin']}</b></div>
        </div>
        <div style="width:48%">
          <div class="muted" style="font-size:11px;letter-spacing:1px">CONSIGNEE</div>
          <div style="margin-top:4px"><b>{d['consignee']}</b></div>
          <div class="muted">{d['dest_addr']}</div>
          <div class="muted">Destination: <b>Mumbai, Maharashtra</b></div>
        </div>
      </div>
      <table>
        <thead><tr><th>Mode</th><th>Pkgs</th><th>Chargeable Wt</th><th>Contents</th><th class="num">Freight</th></tr></thead>
        <tbody>
          <tr><td>{d['mode']}</td><td class="num">{d['pkgs']}</td>
              <td class="num">{d['weight']} kg</td><td>{d['contents']}</td>
              <td class="num">{rupee(freight)}</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Freight</span><span class="num">{rupee(freight)}</span></div>
        <div class="row"><span>Fuel Surcharge</span><span class="num">{rupee(fuel)}</span></div>
        <div class="row"><span>GST @ 18%</span><span class="num">{rupee(gst)}</span></div>
        <div class="row grand"><span>Total Charges</span><span class="num">{rupee(total)}</span></div>
      </div>
      <div class="row" style="margin-top:24px;font-size:12px">
        <div class="muted">
          <div>Payment: {d['payment']}</div>
          <div>Booking Ref: <span class="mono">{d['ref']}</span></div>
          <div>Est. Delivery: {d['eta']}</div>
        </div>
        <div class="right">
          <div style="height:40px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Received in good condition</div>
        </div>
      </div>
      <div class="foot">Track at delhivery.com · Carrier liability limited per consignment terms.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Document data (25)
# --------------------------------------------------------------------------- #
def build_docs():
    docs = []

    # ---- Group 1: GST invoices, Bengaluru suppliers, June 2025 --------------
    gst = [
        ("gst-sunrise-electronics-jun", "Sunrise Electronics", "29AABCS4521M1Z8",
         "No. 18, SP Road, Bengaluru 560002", "080-4123 5567", "sales@sunriseelec.in",
         "SE/2526/0342", "03/06/2025", "PO-CHS-2025-118",
         [{"desc": "Prototype PCB assembly (Rev C)", "hsn": "8534", "qty": 40, "rate": 1850},
          {"desc": "USB-C connector modules", "hsn": "8536", "qty": 120, "rate": 240},
          {"desc": "Assorted passives kit", "hsn": "8532", "qty": 15, "rate": 1200}]),
        ("gst-nandi-components-jun", "Nandi Components", "29AACFN7788K1ZP",
         "42/1, Peenya Industrial Area, Bengaluru 560058", "080-2839 1120", "orders@nandicomp.co.in",
         "NC-0619", "11/06/2025", "PO-CHS-2025-121",
         [{"desc": "Aluminium enclosures (custom)", "hsn": "7616", "qty": 25, "rate": 2100},
          {"desc": "M3 fastener set", "hsn": "7318", "qty": 60, "rate": 95},
          {"desc": "Thermal pads 20x20mm", "hsn": "3919", "qty": 200, "rate": 32}]),
        ("gst-koramangala-hardware-jun", "Koramangala Hardware Supplies", "29AAEFK1290L1ZT",
         "80 Ft Road, 6th Block, Koramangala, Bengaluru 560095", "080-4567 8890", "billing@kmglhardware.in",
         "KHS/25-26/207", "18/06/2025", "PO-CHS-2025-124",
         [{"desc": "Server rack rails 1U", "hsn": "8302", "qty": 12, "rate": 3400},
          {"desc": "Cable management panels", "hsn": "8538", "qty": 18, "rate": 780},
          {"desc": "Cat6 patch cables 2m", "hsn": "8544", "qty": 50, "rate": 145}]),
        ("gst-bharadwaj-traders-jun", "Bharadwaj Traders", "29AAGPB5567R1ZK",
         "Chickpet Main Road, Bengaluru 560053", "080-2226 4410", "accounts@bharadwajtraders.in",
         "BT-1188", "22/06/2025", "PO-CHS-2025-129",
         [{"desc": "Office chairs (ergonomic)", "hsn": "9401", "qty": 8, "rate": 8900},
          {"desc": "Standing desk frames", "hsn": "9403", "qty": 6, "rate": 12400}]),
        ("gst-indiranagar-office-jun", "Indiranagar Office Supplies", "29AADFI3321H1ZW",
         "100 Ft Road, Indiranagar, Bengaluru 560038", "080-4090 7788", "hello@indoffice.in",
         "IOS/2526/455", "27/06/2025", "PO-CHS-2025-133",
         [{"desc": "A4 copier paper (box of 5 reams)", "hsn": "4802", "qty": 20, "rate": 1450},
          {"desc": "Whiteboard markers (pack)", "hsn": "9608", "qty": 30, "rate": 320},
          {"desc": "Laser toner cartridge", "hsn": "8443", "qty": 6, "rate": 4200}]),
    ]
    for (slug, seller, gstin, addr, phone, email, inv, date, po, items) in gst:
        docs.append({
            "slug": slug, "tpl": tpl_gst,
            "data": {"seller": seller, "gstin": gstin, "addr": addr, "phone": phone,
                     "email": email, "inv": inv, "date": date, "po": po, "items": items},
        })

    # ---- Group 2: BESCOM electricity bills, last quarter (Apr-Jun 2026) -----
    bescom = [
        ("bescom-mg-road-apr", "Jayanagar", "MG Road HQ — 3rd Floor, Bengaluru 560001",
         "April 2026", "BLR-2026-04-88231", "RR29-114-002891", "5119002233",
         "01 Apr – 30 Apr 2026", "084213", "080902", 3311, 25, "20/05/2026"),
        ("bescom-mg-road-may", "Jayanagar", "MG Road HQ — 3rd Floor, Bengaluru 560001",
         "May 2026", "BLR-2026-05-90114", "RR29-114-002891", "5119002233",
         "01 May – 31 May 2026", "087740", "084213", 3527, 25, "20/06/2026"),
        ("bescom-mg-road-jun", "Jayanagar", "MG Road HQ — 3rd Floor, Bengaluru 560001",
         "June 2026", "BLR-2026-06-91556", "RR29-114-002891", "5119002233",
         "01 Jun – 30 Jun 2026", "091402", "087740", 3662, 25, "20/07/2026"),
        ("bescom-whitefield-may", "Whitefield", "ITPL Main Road, Whitefield, Bengaluru 560066",
         "May 2026", "BLR-2026-05-90233", "RR29-207-118843", "5120887744",
         "01 May – 31 May 2026", "045210", "043118", 2092, 15, "22/06/2026"),
        ("bescom-whitefield-jun", "Whitefield", "ITPL Main Road, Whitefield, Bengaluru 560066",
         "June 2026", "BLR-2026-06-91802", "RR29-207-118843", "5120887744",
         "01 Jun – 30 Jun 2026", "047418", "045210", 2208, 15, "22/07/2026"),
    ]
    for (slug, subdiv, site, month, billno, rr, acct, period, pres, prev, units, load, due) in bescom:
        docs.append({
            "slug": slug, "tpl": tpl_bescom,
            "data": {"subdiv": subdiv, "site": site, "month": month, "billno": billno,
                     "rr": rr, "acct": acct, "period": period, "pres": pres, "prev": prev,
                     "units": units, "load": load, "due": due},
        })

    # ---- Group 3: Croma laptop receipts ------------------------------------
    croma_store = "Croma, 5th Block Jayanagar, Bengaluru 560041"
    croma = [
        ("croma-macbook-air", "Apple MacBook Air 13\" M3 (16GB/512GB)", 134900,
         "SIN2024AIRM3X8821", "1 yr Apple + 1 yr Croma Care", "SLF/2026/11208",
         "14/02/2026", "R. Menon", "07", "HDFC Credit ****4471", "A20418"),
        ("croma-dell-xps", "Dell XPS 13 9345 (i7/16GB/1TB)", 152990,
         "CN0XPS9345BLR7742", "1 yr Dell ProSupport", "SLF/2026/12744",
         "26/03/2026", "S. Kulkarni", "03", "ICICI Debit ****9920", "A31266"),
        ("croma-thinkpad-e14", "Lenovo ThinkPad E14 Gen 6 (Ryzen 7/16GB)", 87490,
         "LN-E14G6-IN-55210", "3 yr Lenovo onsite", "SLF/2026/14051",
         "09/04/2026", "R. Menon", "05", "Company Card ****1188", "A40913"),
        ("croma-hp-pavilion", "HP Pavilion 14 (i5/16GB/512GB)", 68990,
         "HP5CD440PAV14IN9", "1 yr HP + ADP", "SLF/2026/15320",
         "21/05/2026", "A. Fernandes", "02", "UPI · chaser@hdfcbank", "A52007"),
        ("croma-asus-vivobook", "ASUS Vivobook 15 OLED (i5/16GB)", 61990,
         "ASUSVB15OLED2026Q2", "1 yr ASUS global", "SLF/2026/16688",
         "18/06/2026", "S. Kulkarni", "06", "HDFC Credit ****4471", "A63541"),
    ]
    for (slug, item, price, serial, warranty, inv, date, cashier, till, pay, appr) in croma:
        docs.append({
            "slug": slug, "tpl": tpl_croma,
            "data": {"store": croma_store, "gstin": "29AAACI1195H1ZM", "item": item,
                     "price": price, "serial": serial, "warranty": warranty, "inv": inv,
                     "date": date, "cashier": cashier, "till": till, "pay": pay, "appr": appr},
        })

    # ---- Group 4: Outgoing client invoices > Rs 5 lakh, 2026 ---------------
    client = [
        ("client-invoice-northstar", "Northstar Analytics Pvt Ltd",
         "Cyber Towers, HITEC City, Hyderabad 500081", "36AABCN1123F1Z5",
         "CHS/26-27/041", "12/01/2026", "27/01/2026", "Document AI pilot",
         "50100000441", [
             {"desc": "Search indexing engine — implementation", "amt": 480000},
             {"desc": "On-prem deployment & training (3 days)", "amt": 130000},
         ]),
        ("client-invoice-meridian", "Meridian Legal LLP",
         "Nariman Point, Mumbai 400021", "27AAFCM8890P1ZE",
         "CHS/26-27/058", "04/02/2026", "19/02/2026", "Contracts search rollout",
         "50100000441", [
             {"desc": "Annual platform licence (50 seats)", "amt": 720000},
             {"desc": "Custom OCR tuning for scanned contracts", "amt": 180000},
         ]),
        ("client-invoice-quantvia", "Quantvia Systems Inc",
         "Prestige Tech Park, Marathahalli, Bengaluru 560103", "29AAGCQ4402L1Z9",
         "CHS/26-27/072", "09/03/2026", "24/03/2026", "Knowledge base migration",
         "50100000441", [
             {"desc": "Migration of 1.2M documents", "amt": 390000},
             {"desc": "API integration & SSO", "amt": 165000},
         ]),
        ("client-invoice-blueharbor", "Blue Harbor Shipping Co",
         "Ballard Estate, Mumbai 400001", "27AACCB2231Q1Z2",
         "CHS/26-27/090", "15/04/2026", "30/04/2026", "Fleet-docs search",
         "50100000441", [
             {"desc": "Enterprise licence (unlimited seats)", "amt": 960000},
             {"desc": "Managed indexing — annual", "amt": 320000},
         ]),
        ("client-invoice-everline", "Everline Media Group",
         "Film City Road, Goregaon East, Mumbai 400063", "27AAECE5567R1ZT",
         "CHS/26-27/104", "20/05/2026", "04/06/2026", "Archive search",
         "50100000441", [
             {"desc": "Media archive indexing (8 yrs)", "amt": 430000},
             {"desc": "Priority support — annual", "amt": 160000},
         ]),
    ]
    for (slug, cl, cl_addr, cl_gstin, inv, date, due, project, acct, items) in client:
        docs.append({
            "slug": slug, "tpl": tpl_client,
            "data": {"client": cl, "client_addr": cl_addr, "client_gstin": cl_gstin,
                     "inv": inv, "date": date, "due": due, "project": project,
                     "acct": acct, "items": items},
        })

    # ---- Group 5: Delhivery consignment notes -> Mumbai --------------------
    delh = [
        ("delhivery-blr-mumbai", "159284410077", "22/01/2026", "Bengaluru, Karnataka",
         "HSR Layout Sector 2, Bengaluru 560102", "Meridian Legal LLP",
         "Nariman Point, Mumbai 400021", "Surface", 3, "12.4",
         "Hardware tokens & manuals", 1180, "Prepaid", "BK-772041", "25 Jan 2026"),
        ("delhivery-del-mumbai", "159311902845", "07/02/2026", "New Delhi, Delhi",
         "Okhla Phase 2, New Delhi 110020", "Blue Harbor Shipping Co",
         "Ballard Estate, Mumbai 400001", "Air", 1, "2.1",
         "Signed contracts (sealed)", 640, "To Pay", "BK-778820", "09 Feb 2026"),
        ("delhivery-maa-mumbai", "159402277163", "18/03/2026", "Chennai, Tamil Nadu",
         "Guindy Industrial Estate, Chennai 600032", "Everline Media Group",
         "Goregaon East, Mumbai 400063", "Surface", 5, "28.6",
         "Archive drives (padded)", 2240, "Prepaid", "BK-784417", "23 Mar 2026"),
        ("delhivery-hyd-mumbai", "159488120934", "11/04/2026", "Hyderabad, Telangana",
         "HITEC City, Hyderabad 500081", "Northstar Analytics Pvt Ltd",
         "Andheri East, Mumbai 400059", "Air", 2, "5.8",
         "Demo units (fragile)", 980, "Prepaid", "BK-790255", "13 Apr 2026"),
        ("delhivery-pnq-mumbai", "159560338471", "29/05/2026", "Pune, Maharashtra",
         "Hinjewadi Phase 1, Pune 411057", "Quantvia Systems Inc",
         "Powai, Mumbai 400076", "Surface", 4, "17.9",
         "Marketing collateral", 760, "Prepaid", "BK-796610", "31 May 2026"),
    ]
    for (slug, awb, date, origin, origin_addr, consignee, dest_addr, mode, pkgs,
         weight, contents, freight, payment, ref, eta) in delh:
        docs.append({
            "slug": slug, "tpl": tpl_delhivery,
            "data": {"gstin": "27AACCD1234M1Z9", "awb": awb, "date": date,
                     "origin": origin, "origin_addr": origin_addr, "consignee": consignee,
                     "dest_addr": dest_addr, "mode": mode, "pkgs": pkgs, "weight": weight,
                     "contents": contents, "freight": freight, "payment": payment,
                     "ref": ref, "eta": eta},
        })

    return docs


# --------------------------------------------------------------------------- #
# Render + scan effect
# --------------------------------------------------------------------------- #
def render_png(markup, png_path):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as fh:
        fh.write(markup)
        html_path = fh.name
    try:
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
             "--force-device-scale-factor=2", "--window-size=1000,1420",
             "--default-background-color=FFFFFFFF",
             f"--screenshot={png_path}", "--virtual-time-budget=1500",
             f"file://{html_path}"],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
    finally:
        os.unlink(html_path)


def scanify(png_path, jpg_path, tilt):
    im = Image.open(png_path).convert("RGB")
    # Downscale the 2x capture to a natural page width.
    target_w = 1000
    if im.width != target_w:
        h = round(im.height * target_w / im.width)
        im = im.resize((target_w, h), Image.LANCZOS)
    # Slight rotation, off-white fill (paper on a scanner bed).
    im = im.rotate(tilt, expand=True, resample=Image.BICUBIC, fillcolor=(216, 216, 212))
    # Warm the paper very slightly and soften like a scan.
    im = ImageOps.autocontrast(im, cutoff=0.5)
    im = im.filter(ImageFilter.GaussianBlur(0.4))
    # Faint grain.
    noise = Image.effect_noise(im.size, 14).convert("RGB")
    im = Image.blend(im, noise, 0.035)
    im.save(jpg_path, "JPEG", quality=82, optimize=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    docs = build_docs()
    assert len(docs) == 25, f"expected 25 docs, got {len(docs)}"
    tmp_png = os.path.join(tempfile.gettempdir(), "chaser_doc.png")
    for i, doc in enumerate(docs):
        markup = doc["tpl"](doc["data"])
        jpg = os.path.join(OUT_DIR, doc["slug"] + ".jpg")
        render_png(markup, tmp_png)
        scanify(tmp_png, jpg, TILTS[i % len(TILTS)])
        size_kb = os.path.getsize(jpg) // 1024
        print(f"[{i + 1:2}/25] {doc['slug']}.jpg  ({size_kb} KB)")
    if os.path.exists(tmp_png):
        os.unlink(tmp_png)
    print(f"\nDone. 25 JPEGs written to {OUT_DIR}")


if __name__ == "__main__":
    main()
