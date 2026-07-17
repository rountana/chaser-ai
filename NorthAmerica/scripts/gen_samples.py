#!/usr/bin/env python3
"""
Generate 25 fabricated "scanned document" JPEGs for the chaserAI North America
landing-page demo — 5 documents for each of 5 example queries — plus a
highlight map (lib/sampleHighlights.json) giving the on-page location of each
document's type / party / amount / date, so the auto-demo can glow-highlight
the field that matched a query.

Approach: render realistic HTML document templates with headless Google Chrome.
A small inline script measures the bounding box of every [data-hl] element and
its page height; one --dump-dom pass reads those back, and a second --screenshot
pass captures the image at that exact height. PIL then gives each a light scanned
look (off-white paper, faint blur + grain) — kept axis-aligned (no tilt) so the
highlight boxes line up pixel-for-pixel.

All company names, EINs, addresses and dollar amounts are FICTITIOUS. Retailer
and carrier names (Costco, Home Depot, Amazon Business, Best Buy, Staples,
FedEx, UPS) are used only as realistic stand-ins for the kind of receipts a
North American small business piles up — no affiliation implied.

Usage:  python3 scripts/gen_samples.py
Output: public/samples/*.jpg  +  lib/sampleHighlights.json   (both committed)

Requires: Google Chrome (macOS) and Pillow — both already on the dev machine.
"""

import json
import math
import os
import re
import subprocess
import tempfile

from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "samples")
HL_PATH = os.path.join(ROOT, "lib", "sampleHighlights.json")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PAGE_W = 1000  # final image width in px

OUR_CO = "Harborview Consulting LLC"
OUR_ADDR = "1420 Wabash Ave, Suite 300, Chicago, IL 60605"
OUR_EIN = "36-4127590"


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def usd(n):
    n = int(round(n))
    return f"${n:,}"


def fmt_num(n):
    return f"{int(round(n)):,}"


# --------------------------------------------------------------------------- #
# Shared styling + measurement script
# --------------------------------------------------------------------------- #
CSS = """
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #d8d8d4; }
  .page {
    width: 900px; margin: 40px auto; background: #fdfdfb;
    padding: 46px 50px; color: #1a1a1a; position: relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    font-family: "Helvetica Neue", Arial, sans-serif; font-size: 14px;
  }
  .serif { font-family: Georgia, "Times New Roman", serif; }
  .mono  { font-family: "Courier New", monospace; }
  .muted { color: #555; }
  .right { text-align: right; }
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
  .sign { margin-top: 46px; }
  .foot { margin-top: 40px; padding-top: 10px; font-size: 11px; color: #888;
    text-align: center; border-top: 1px solid #e2e2dc; }
"""

MEASURE_JS = """
  addEventListener('load', function () {
    var W = window.innerWidth;
    var H = document.documentElement.scrollHeight;
    var out = { h: H, boxes: {} };
    document.querySelectorAll('[data-hl]').forEach(function (e) {
      var r = e.getBoundingClientRect();
      out.boxes[e.getAttribute('data-hl')] = [
        +(r.left / W).toFixed(4), +(r.top / H).toFixed(4),
        +(r.width / W).toFixed(4), +(r.height / H).toFixed(4)
      ];
    });
    var p = document.createElement('pre');
    p.id = '__boxes__';
    p.style.display = 'none';
    p.textContent = JSON.stringify(out);
    document.body.appendChild(p);
  });
"""


def html(body):
    return (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<style>{CSS}</style></head><body>{body}"
        f"<script>{MEASURE_JS}</script></body></html>"
    )


# --------------------------------------------------------------------------- #
# Template 1 — Vendor / Sales Invoice (billed to Harborview Consulting)
# --------------------------------------------------------------------------- #
def tpl_vendor(d):
    rows, sub = "", 0
    for i, it in enumerate(d["items"], 1):
        amt = it["qty"] * it["rate"]
        sub += amt
        rows += (
            f"<tr><td>{i}</td><td>{it['desc']}</td><td class='mono'>{it['sku']}</td>"
            f"<td class='num'>{it['qty']}</td><td class='num'>{usd(it['rate'])}</td>"
            f"<td class='num'>{usd(amt)}</td></tr>"
        )
    tax = round(sub * 0.0875)
    total = sub + tax
    body = f"""
    <div class="page">
      <div class="stamp">PAID</div>
      <div class="row">
        <div>
          <h1 class="serif" data-hl="party">{d['seller']}</h1>
          <div class="muted" style="margin-top:6px;max-width:420px">{d['addr']}</div>
          <div class="muted" style="margin-top:4px">Phone: {d['phone']} &nbsp;·&nbsp; {d['email']}</div>
          <div style="margin-top:6px"><b>EIN:</b> <span class="mono">{d['ein']}</span></div>
        </div>
        <div class="right">
          <h2 class="serif" data-hl="type">INVOICE</h2>
          <div style="margin-top:10px"><b>Invoice No:</b> <span class="mono">{d['inv']}</span></div>
          <div data-hl="date"><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted" style="margin-top:6px">Terms: Net 30</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">BILL TO</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted" style="max-width:360px">{OUR_ADDR}</div>
        </div>
        <div class="right muted">
          <div style="font-size:11px;letter-spacing:1px">PURCHASE ORDER</div>
          <div class="mono" style="margin-top:4px">{d['po']}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>SKU</th>
          <th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Subtotal</span><span class="num">{usd(sub)}</span></div>
        <div class="row"><span>Sales Tax (8.75%)</span><span class="num">{usd(tax)}</span></div>
        <div class="row grand" data-hl="amount"><span>Total</span><span class="num">{usd(total)}</span></div>
      </div>
      <div class="row sign">
        <div class="muted" style="font-size:12px;max-width:360px">
          Goods once sold are non-returnable after 30 days. Subject to Cook County, IL jurisdiction.
        </div>
        <div class="right">
          <div style="height:40px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Authorized Signature</div>
          <div>for {d['seller']}</div>
        </div>
      </div>
      <div class="foot">This is a computer-generated invoice.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 2 — Utility Bill (Lakeshore Power & Light)
# --------------------------------------------------------------------------- #
def tpl_utility(d):
    energy = round(d["kwh"] * 0.14)
    fixed = 42
    tax = round((energy + fixed) * 0.06)
    total = energy + fixed + tax
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 class="serif" style="color:#123f7a" data-hl="party">Lakeshore Power &amp; Light</h1>
          <div class="muted">Serving Northern Illinois since 1958</div>
          <div class="muted" style="font-size:12px">{d['subdiv']} Service Area</div>
        </div>
        <div class="right">
          <div class="pill" data-hl="type">ELECTRIC BILL</div>
          <div style="margin-top:8px" data-hl="date"><b>Bill Month:</b> {d['month']}</div>
          <div class="muted">Bill No: <span class="mono">{d['billno']}</span></div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">SERVICE ADDRESS</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted" style="max-width:360px">{d['site']}</div>
        </div>
        <div class="right">
          <div><b>Account No:</b> <span class="mono">{d['acct']}</span></div>
          <div><b>Meter No:</b> <span class="mono">{d['meter']}</span></div>
          <div class="muted">Rate Class: Small Commercial</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th class="num">Reading / Value</th></tr></thead>
        <tbody>
          <tr><td>Billing Period</td><td class="num">{d['period']}</td></tr>
          <tr><td>Current Reading</td><td class="num">{d['pres']}</td></tr>
          <tr><td>Previous Reading</td><td class="num">{d['prev']}</td></tr>
          <tr><td>Energy Used (kWh)</td><td class="num">{fmt_num(d['kwh'])}</td></tr>
          <tr><td>Energy Charges @ $0.14/kWh</td><td class="num">{usd(energy)}</td></tr>
          <tr><td>Customer Charge</td><td class="num">{usd(fixed)}</td></tr>
          <tr><td>State &amp; Municipal Taxes</td><td class="num">{usd(tax)}</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row grand" data-hl="amount"><span>Total Amount Due</span><span class="num">{usd(total)}</span></div>
        <div class="row"><span class="muted">Due Date</span><span class="mono">{d['due']}</span></div>
      </div>
      <div style="margin-top:20px;font-size:12px" class="muted">
        Pay online at lakeshorepower.example or by mail. A late fee of 1.5% per month applies after the due date.
      </div>
      <div class="foot">Lakeshore Power &amp; Light · Customer Care (855) 555-0142 · System-generated bill.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 3 — Big-box / office retail receipt
# --------------------------------------------------------------------------- #
def tpl_retail(d):
    taxable = d["price"]
    tax = round(taxable * d.get("tax_rate", 0.0875))
    total = taxable + tax
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 style="color:{d['color']};letter-spacing:1px" data-hl="party">{d['store']}</h1>
          <div class="muted" style="font-size:12px">{d['store_sub']}</div>
          <div class="muted" style="font-size:12px;max-width:360px">{d['store_addr']}</div>
        </div>
        <div class="right">
          <div class="pill" data-hl="type">RETAIL RECEIPT</div>
          <div style="margin-top:8px"><b>Receipt:</b> <span class="mono">{d['inv']}</span></div>
          <div data-hl="date"><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted">Register: {d['till']} · Cashier: {d['cashier']}</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">CUSTOMER</div>
          <div style="margin-top:4px">{OUR_CO}</div>
        </div>
        <div class="right muted"><div>Payment: {d['pay']}</div><div>Auth: {d['appr']}</div></div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>SKU</th><th class="num">Qty</th><th class="num">Amount</th></tr></thead>
        <tbody>
          <tr><td><b>{d['item']}</b></td><td class="mono">{d['sku']}</td>
              <td class="num">1</td><td class="num">{usd(taxable)}</td></tr>
          <tr><td class="muted" colspan="3">{d['note']}</td>
              <td class="num muted">—</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Subtotal</span><span class="num">{usd(taxable)}</span></div>
        <div class="row"><span>Sales Tax</span><span class="num">{usd(tax)}</span></div>
        <div class="row grand" data-hl="amount"><span>Total Paid</span><span class="num">{usd(total)}</span></div>
      </div>
      <div style="margin-top:22px;font-size:12px" class="muted">
        {d['return_policy']}
      </div>
      <div class="foot">{d['footer']}</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 4 — Outgoing Client Invoice (services, no sales tax)
# --------------------------------------------------------------------------- #
def tpl_client(d):
    rows, sub = "", 0
    for it in d["items"]:
        sub += it["amt"]
        rows += f"<tr><td>{it['desc']}</td><td class='num'>{usd(it['amt'])}</td></tr>"
    body = f"""
    <div class="page">
      <div class="row">
        <div>
          <h1 class="serif">{OUR_CO}</h1>
          <div class="muted" style="max-width:380px;margin-top:6px">{OUR_ADDR}</div>
          <div style="margin-top:6px"><b>EIN:</b> <span class="mono">{OUR_EIN}</span></div>
        </div>
        <div class="right">
          <h2 class="serif" data-hl="type">INVOICE</h2>
          <div style="margin-top:10px"><b>No:</b> <span class="mono">{d['inv']}</span></div>
          <div data-hl="date"><b>Date:</b> <span class="mono">{d['date']}</span></div>
          <div class="muted" style="margin-top:4px">Due: {d['due']}</div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div>
          <div class="muted" style="font-size:11px;letter-spacing:1px">BILL TO</div>
          <div style="margin-top:4px" data-hl="party"><b>{d['client']}</b></div>
          <div class="muted" style="max-width:360px">{d['client_addr']}</div>
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
        <div class="row grand" data-hl="amount"><span>Total Due</span><span class="num">{usd(sub)}</span></div>
      </div>
      <div class="thin" style="margin-top:26px"></div>
      <div class="row" style="font-size:12px;margin-top:8px">
        <div class="muted">
          <div style="font-size:11px;letter-spacing:1px;color:#333">REMIT TO</div>
          <div>First Midwest Bank · Acct {d['acct']}</div>
          <div>Routing 071000019 · Chicago Loop Branch</div>
        </div>
        <div class="right">
          <div style="height:36px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Authorized Signature</div>
        </div>
      </div>
      <div class="foot">Thank you for your business. Payment due net 15 days from invoice date.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Template 5 — Carrier Bill (FedEx / UPS)
# --------------------------------------------------------------------------- #
def tpl_courier(d):
    freight = d["freight"]
    fuel = round(freight * 0.16)
    total = freight + fuel
    body = f"""
    <div class="page">
      <div class="row" style="align-items:flex-start">
        <div>
          <h1 style="color:{d['color']};letter-spacing:1px" data-hl="party">{d['carrier']}</h1>
          <div class="muted" style="font-size:12px">{d['carrier_sub']}</div>
        </div>
        <div class="right">
          <div class="pill" data-hl="type">SHIPPING INVOICE</div>
          <div style="margin-top:8px"><b>Tracking:</b> <span class="mono" style="font-size:16px">{d['tracking']}</span></div>
          <div class="muted" data-hl="date">Date: <span class="mono">{d['date']}</span></div>
        </div>
      </div>
      <div class="rule"></div>
      <div class="row">
        <div style="width:48%">
          <div class="muted" style="font-size:11px;letter-spacing:1px">SHIPPER</div>
          <div style="margin-top:4px"><b>{OUR_CO}</b></div>
          <div class="muted">{d['origin_addr']}</div>
        </div>
        <div style="width:48%">
          <div class="muted" style="font-size:11px;letter-spacing:1px">RECIPIENT</div>
          <div style="margin-top:4px"><b>{d['consignee']}</b></div>
          <div class="muted">{d['dest_addr']}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Service</th><th>Pkgs</th><th>Billed Wt</th><th>Contents</th><th class="num">Freight</th></tr></thead>
        <tbody>
          <tr><td>{d['mode']}</td><td class="num">{d['pkgs']}</td>
              <td class="num">{d['weight']} lb</td><td>{d['contents']}</td>
              <td class="num">{usd(freight)}</td></tr>
        </tbody>
      </table>
      <div class="totbox">
        <div class="row"><span>Freight</span><span class="num">{usd(freight)}</span></div>
        <div class="row"><span>Fuel Surcharge</span><span class="num">{usd(fuel)}</span></div>
        <div class="row grand" data-hl="amount"><span>Total Charges</span><span class="num">{usd(total)}</span></div>
      </div>
      <div class="row" style="margin-top:24px;font-size:12px">
        <div class="muted">
          <div>Payment: {d['payment']}</div>
          <div>Account: <span class="mono">{d['ref']}</span></div>
          <div>Est. Delivery: {d['eta']}</div>
        </div>
        <div class="right">
          <div style="height:36px"></div>
          <div class="thin" style="width:200px;margin-left:auto"></div>
          <div class="muted">Received in good condition</div>
        </div>
      </div>
      <div class="foot">Track at {d['track_url']} · Carrier liability limited per published tariff.</div>
    </div>
    """
    return html(body)


# --------------------------------------------------------------------------- #
# Document data (25)
# --------------------------------------------------------------------------- #
def build_docs():
    docs = []

    vendor = [
        ("vendor-ironclad-hardware-jun", "Ironclad Hardware Supply", "36-2210987",
         "4410 Damen Ave, Chicago, IL 60618", "312-555-0118", "orders@ironcladhardware.example",
         "IHS-5521", "06/12/2025", "PO-HC-2025-118",
         [{"desc": "48U server rack rails", "sku": "RK-4408", "qty": 4, "rate": 340},
          {"desc": "Cat6 patch panel, 24-port", "sku": "PP-2406", "qty": 3, "rate": 118},
          {"desc": "Cable management arms", "sku": "CM-1120", "qty": 8, "rate": 62}]),
        ("vendor-summit-furnishings-jun", "Summit Business Furnishings", "36-3387421",
         "220 W Grand Ave, Chicago, IL 60654", "312-555-0166", "sales@summitfurnishings.example",
         "SBF-2291", "06/05/2025", "PO-HC-2025-119",
         [{"desc": "Ergonomic office chair", "sku": "CH-8802", "qty": 6, "rate": 429},
          {"desc": "Standing desk frame", "sku": "DK-1140", "qty": 4, "rate": 610}]),
        ("vendor-cascade-office-jun", "Cascade Office Essentials", "36-4471209",
         "88 E Randolph St, Chicago, IL 60601", "312-555-0193", "billing@cascadeoffice.example",
         "COE-3087", "06/20/2025", "PO-HC-2025-121",
         [{"desc": "Letter-size copier paper, case", "sku": "PP-5001", "qty": 12, "rate": 42},
          {"desc": "Laser toner cartridge", "sku": "TN-2210", "qty": 4, "rate": 89},
          {"desc": "Dry-erase markers, box", "sku": "MK-0034", "qty": 10, "rate": 14}]),
        ("vendor-meridian-print-jun", "Meridian Print & Packaging", "36-5502318",
         "710 N Milwaukee Ave, Chicago, IL 60642", "312-555-0147", "orders@meridianprint.example",
         "MPP-6612", "06/26/2025", "PO-HC-2025-124",
         [{"desc": "Corrugated shipping boxes, bundle", "sku": "BX-3320", "qty": 20, "rate": 22},
          {"desc": "Business cards, 1000ct", "sku": "BC-1001", "qty": 2, "rate": 145}]),
        ("vendor-crestline-it-jun", "Crestline IT Solutions", "36-6693015",
         "55 W Wacker Dr, Chicago, IL 60601", "312-555-0179", "sales@crestlineit.example",
         "CIT-8840", "06/30/2025", "PO-HC-2025-129",
         [{"desc": "27-inch business monitor", "sku": "MN-2790", "qty": 6, "rate": 289},
          {"desc": "USB-C docking station", "sku": "DK-4471", "qty": 6, "rate": 179},
          {"desc": "Wireless keyboard & mouse set", "sku": "KM-1183", "qty": 6, "rate": 58}]),
    ]
    for (slug, seller, ein, addr, phone, email, inv, date, po, items) in vendor:
        docs.append({"slug": slug, "tpl": tpl_vendor,
                     "data": {"seller": seller, "ein": ein, "addr": addr, "phone": phone,
                              "email": email, "inv": inv, "date": date, "po": po, "items": items}})

    utility = [
        ("utility-loop-apr", "Chicago Loop", "1420 Wabash Ave, Suite 300, Chicago, IL 60605",
         "April 2026", "LPL-2026-04-77213", "8815002214", "MTR-40217", 3311, "05/20/2026"),
        ("utility-loop-may", "Chicago Loop", "1420 Wabash Ave, Suite 300, Chicago, IL 60605",
         "May 2026", "LPL-2026-05-79015", "8815002214", "MTR-40217", 3527, "06/20/2026"),
        ("utility-loop-jun", "Chicago Loop", "1420 Wabash Ave, Suite 300, Chicago, IL 60605",
         "June 2026", "LPL-2026-06-80522", "8815002214", "MTR-40217", 3662, "07/20/2026"),
        ("utility-evanston-may", "Evanston", "807 Davis St, Evanston, IL 60201",
         "May 2026", "LPL-2026-05-79240", "8822109937", "MTR-51190", 2092, "06/22/2026"),
        ("utility-evanston-jun", "Evanston", "807 Davis St, Evanston, IL 60201",
         "June 2026", "LPL-2026-06-80811", "8822109937", "MTR-51190", 2208, "07/22/2026"),
    ]
    for (slug, subdiv, site, month, billno, acct, meter, kwh, due) in utility:
        docs.append({"slug": slug, "tpl": tpl_utility,
                     "data": {"subdiv": subdiv, "site": site, "month": month, "billno": billno,
                              "acct": acct, "meter": meter, "kwh": kwh,
                              "period": month, "pres": 84213 + kwh, "prev": 84213, "due": due}})

    retail = [
        ("retail-costco-jun", "COSTCO WHOLESALE", "#1042 Chicago", "3450 N Kedzie Ave, Chicago, IL 60618",
         "#7f1e8b", 0.0, "Office pantry restock — bottled water, coffee, snacks",
         "Costco Wholesale · costco.com · Member Services (800) 555-0110",
         "Returns accepted within 90 days with receipt.",
         "Bulk office pantry supplies", "WH-88231", 214, "R. Alvarez", "04", "Business Debit ****2210", "A20418",
         "06/18/2026"),
        ("retail-homedepot-may", "THE HOME DEPOT", "Store #4471", "2500 S Ashland Ave, Chicago, IL 60608",
         "#f96302", 0.0875, "Office renovation — shelving and hardware",
         "The Home Depot · homedepot.com · 1-800-555-0166",
         "Returns accepted within 90 days with receipt.",
         "Wall-mount shelving unit", "HD-55210", 268, "D. Ferreira", "02", "Company Card ****1188", "A31266",
         "05/21/2026"),
        ("retail-amazonbiz-jun", "AMAZON BUSINESS", "Order confirmation", "Fulfilled from Amazon.com Services LLC",
         "#ff9900", 0.0875, "Bulk order — webcams and HDMI cables for conference rooms",
         "Amazon Business · business.amazon.com",
         "Returns accepted within 30 days per Amazon Business policy.",
         "Conference room webcam bundle (x6)", "AZ-90114", 612, "—", "—", "Business Prime Card ****4471", "A40913",
         "06/12/2026"),
        ("retail-bestbuy-mar", "BEST BUY", "Store #1091 River North", "10 W Grand Ave, Chicago, IL 60654",
         "#0046be", 0.0875, "New-hire laptop purchase",
         "Best Buy · bestbuy.com · 1-888-555-0142",
         "Returns accepted within 15 days with receipt (Best Buy policy).",
         "Dell XPS 13 9345 (i7/16GB/1TB)", "BB-77420", 1399, "M. Okafor", "07", "Visa ****9920", "A52007",
         "03/26/2026"),
        ("retail-staples-apr", "STAPLES", "Store #0872", "1145 N State St, Chicago, IL 60610",
         "#cc0000", 0.0875, "Office supplies restock",
         "Staples · staples.com · 1-800-555-0123",
         "Returns accepted within 14 days with receipt.",
         "All-in-one laser printer", "ST-31209", 349, "T. Nguyen", "03", "Company Card ****1188", "A63541",
         "04/09/2026"),
    ]
    for (slug, store, store_sub, store_addr, color, tax_rate, note, footer, return_policy,
         item, sku, price, cashier, till, pay_method, appr, date) in retail:
        docs.append({"slug": slug, "tpl": tpl_retail,
                     "data": {"store": store, "store_sub": store_sub, "store_addr": store_addr,
                              "color": color, "tax_rate": tax_rate, "note": note, "item": item,
                              "sku": sku, "price": price, "cashier": cashier, "till": till,
                              "pay": pay_method, "appr": appr, "date": date, "inv": f"{sku}-{till}",
                              "return_policy": return_policy, "footer": footer}})

    client = [
        ("client-invoice-brightpath", "Bright Path Analytics Inc",
         "600 Congress Ave, Austin, TX 78701",
         "HC-26-041", "01/12/2026", "01/27/2026", "Document search pilot",
         "40100000441", [{"desc": "Search indexing engine — implementation", "amt": 21400},
                         {"desc": "Onsite deployment & training (3 days)", "amt": 7000}]),
        ("client-invoice-cedarstone", "Cedar & Stone Law Group",
         "1 Beacon St, Boston, MA 02108",
         "HC-26-058", "02/04/2026", "02/19/2026", "Contracts search rollout",
         "40100000441", [{"desc": "Annual platform license (25 seats)", "amt": 48500},
                         {"desc": "Custom OCR tuning for scanned exhibits", "amt": 13000}]),
        ("client-invoice-unionsquare", "Union Square Realty Partners",
         "1 Broadway, Denver, CO 80202",
         "HC-26-072", "03/09/2026", "03/24/2026", "Closing-docs search",
         "40100000441", [{"desc": "Migration of 8 years of closing documents", "amt": 14200},
                         {"desc": "API integration & SSO", "amt": 5600}]),
        ("client-invoice-pinecrest", "Pinecrest Manufacturing Co",
         "4500 Euclid Ave, Cleveland, OH 44103",
         "HC-26-090", "04/15/2026", "04/30/2026", "Vendor-invoice search",
         "40100000441", [{"desc": "Enterprise license (unlimited seats)", "amt": 26800},
                         {"desc": "Managed indexing — annual", "amt": 7400}]),
        ("client-invoice-delmar", "Del Mar Hospitality Group",
         "701 5th Ave, San Diego, CA 92101",
         "HC-26-104", "05/20/2026", "06/04/2026", "Vendor & invoice archive",
         "40100000441", [{"desc": "Multi-location invoice archive indexing", "amt": 9800},
                         {"desc": "Priority support — annual", "amt": 2850}]),
    ]
    for (slug, cl, cl_addr, inv, date, due, project, acct, items) in client:
        docs.append({"slug": slug, "tpl": tpl_client,
                     "data": {"client": cl, "client_addr": cl_addr,
                              "inv": inv, "date": date, "due": due, "project": project,
                              "acct": acct, "items": items}})

    courier = [
        ("courier-fedex-austin", "FedEx", "Federal Express Corporation · Ground Service",
         "#4d148c", "782044109938", "01/22/2026", "Chicago, IL",
         "1420 Wabash Ave, Suite 300, Chicago, IL 60605", "Bright Path Analytics Inc",
         "600 Congress Ave, Austin, TX 78701", "Ground", 2, "18", "Demo hardware & drives",
         118, "Prepaid", "FX-772041", "25 Jan 2026", "fedex.com"),
        ("courier-ups-boston", "UPS", "United Parcel Service · Next Day Air",
         "#341c02", "1Z9A87W40312445890", "02/07/2026", "Chicago, IL",
         "1420 Wabash Ave, Suite 300, Chicago, IL 60605", "Cedar & Stone Law Group",
         "1 Beacon St, Boston, MA 02108", "Air", 1, "4", "Signed exhibits (sealed)",
         64, "Prepaid", "UP-778820", "09 Feb 2026", "ups.com"),
        ("courier-fedex-denver", "FedEx", "Federal Express Corporation · Ground Service",
         "#4d148c", "782061837765", "03/18/2026", "Chicago, IL",
         "1420 Wabash Ave, Suite 300, Chicago, IL 60605", "Union Square Realty Partners",
         "1 Broadway, Denver, CO 80202", "Ground", 3, "22", "Closing documents & disclosures",
         96, "Prepaid", "FX-784417", "23 Mar 2026", "fedex.com"),
        ("courier-ups-cleveland", "UPS", "United Parcel Service · Ground",
         "#341c02", "1Z9A87W40315509934", "04/11/2026", "Chicago, IL",
         "1420 Wabash Ave, Suite 300, Chicago, IL 60605", "Pinecrest Manufacturing Co",
         "4500 Euclid Ave, Cleveland, OH 44103", "Ground", 2, "31", "Equipment & manuals",
         58, "Prepaid", "UP-790255", "13 Apr 2026", "ups.com"),
        ("courier-fedex-sandiego", "FedEx", "Federal Express Corporation · Air Service",
         "#4d148c", "782099204471", "05/29/2026", "Chicago, IL",
         "1420 Wabash Ave, Suite 300, Chicago, IL 60605", "Del Mar Hospitality Group",
         "701 5th Ave, San Diego, CA 92101", "Air", 4, "27", "Marketing collateral",
         142, "Prepaid", "FX-796610", "31 May 2026", "fedex.com"),
    ]
    for (slug, carrier, carrier_sub, color, tracking, date, origin, origin_addr, consignee,
         dest_addr, mode, pkgs, weight, contents, freight, payment, ref, eta, track_url) in courier:
        docs.append({"slug": slug, "tpl": tpl_courier,
                     "data": {"carrier": carrier, "carrier_sub": carrier_sub, "color": color,
                              "tracking": tracking, "date": date, "origin_addr": origin_addr,
                              "consignee": consignee, "dest_addr": dest_addr, "mode": mode,
                              "pkgs": pkgs, "weight": weight, "contents": contents,
                              "freight": freight, "payment": payment, "ref": ref, "eta": eta,
                              "track_url": track_url}})

    return docs


# --------------------------------------------------------------------------- #
# Render + scan effect
# --------------------------------------------------------------------------- #
def write_html(markup):
    fh = tempfile.NamedTemporaryFile("w", suffix=".html", delete=False)
    fh.write(markup)
    fh.close()
    return fh.name


def measure(html_path):
    """First pass: run the page and read back the [data-hl] boxes + page height."""
    res = subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--window-size=1000,1000",
         "--virtual-time-budget=1500", "--dump-dom", f"file://{html_path}"],
        capture_output=True, text=True,
    )
    m = re.search(r'id="__boxes__"[^>]*>(.*?)</pre>', res.stdout, re.S)
    if not m:
        raise RuntimeError("could not read highlight boxes from dump-dom")
    return json.loads(m.group(1))


def shoot(html_path, png_path, height):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=2", f"--window-size=1000,{height}",
         "--default-background-color=FFFFFFFF",
         f"--screenshot={png_path}", "--virtual-time-budget=1500", f"file://{html_path}"],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def scanify(png_path, jpg_path):
    """Axis-aligned scanned look — no tilt, so highlight boxes stay aligned."""
    im = Image.open(png_path).convert("RGB")
    if im.width != PAGE_W:
        h = round(im.height * PAGE_W / im.width)
        im = im.resize((PAGE_W, h), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=0.5)
    im = im.filter(ImageFilter.GaussianBlur(0.4))
    noise = Image.effect_noise(im.size, 14).convert("RGB")
    im = Image.blend(im, noise, 0.035)
    im.save(jpg_path, "JPEG", quality=82, optimize=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    docs = build_docs()
    assert len(docs) == 25, f"expected 25 docs, got {len(docs)}"
    tmp_png = os.path.join(tempfile.gettempdir(), "chaser_doc_na.png")
    highlights = {}
    for i, doc in enumerate(docs):
        markup = doc["tpl"](doc["data"])
        html_path = write_html(markup)
        try:
            meas = measure(html_path)
            shoot(html_path, tmp_png, math.ceil(meas["h"]))
        finally:
            os.unlink(html_path)
        jpg = doc["slug"] + ".jpg"
        scanify(tmp_png, os.path.join(OUT_DIR, jpg))
        highlights[jpg] = meas["boxes"]
        size_kb = os.path.getsize(os.path.join(OUT_DIR, jpg)) // 1024
        print(f"[{i + 1:2}/25] {jpg}  ({size_kb} KB, {len(meas['boxes'])} boxes)")
    if os.path.exists(tmp_png):
        os.unlink(tmp_png)
    with open(HL_PATH, "w") as fh:
        json.dump(highlights, fh, indent=0, sort_keys=True)
    print(f"\nDone. 25 JPEGs → {OUT_DIR}")
    print(f"Highlight map → {HL_PATH}")


if __name__ == "__main__":
    main()
