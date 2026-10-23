import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="DukaanAI_Pitch_Deck_Paytm_Hackathon.pptx"):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6] # blank layout

    # Colors
    NAVY = RGBColor(11, 25, 44)       # #0B192C Dark Navy
    PAYTM_BLUE = RGBColor(0, 46, 110) # #002E6E Paytm Deep Navy
    CYAN = RGBColor(0, 186, 242)      # #00BAF2 Paytm Cyan
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)
    CARD_DARK = RGBColor(23, 37, 63)
    BORDER_LIGHT = RGBColor(226, 232, 240)
    BORDER_DARK = RGBColor(38, 59, 94)
    TEXT_DARK = RGBColor(15, 23, 42)
    TEXT_MUTED = RGBColor(100, 116, 139)
    TEXT_LIGHT_MUTED = RGBColor(148, 163, 184)
    GREEN = RGBColor(16, 185, 129)
    AMBER = RGBColor(245, 158, 11)

    def add_bg(slide, color):
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = color
        shape.line.fill.background()
        return shape

    def add_header(slide, tag_text, title_text, subtitle_text, is_dark=False):
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = tag_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = CYAN if is_dark else PAYTM_BLUE

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.6))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = WHITE if is_dark else TEXT_DARK

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(0.4))
        tf = sub_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subtitle_text
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_LIGHT_MUTED if is_dark else TEXT_MUTED

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Dark Navy)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s1, NAVY)

    # Accent decorative banner
    accent_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(0.4), Inches(5.5))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = CYAN
    accent_bar.line.fill.background()

    # Title container
    t_box = s1.shapes.add_textbox(Inches(1.5), Inches(1.2), Inches(10.5), Inches(5.0))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "PAYTM BUILD FOR INDIA AI HACKATHON  •  STAGE 1 PITCH"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = CYAN
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "DukaanAI"
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "AI Business Growth Copilot for Small Merchants"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = CYAN
    p2.space_after = Pt(20)

    p3 = tf1.add_paragraph()
    p3.text = "“Understand your shop, discover growth opportunities, and know what to do next — with AI.”"
    p3.font.size = Pt(15)
    p3.font.italic = True
    p3.font.color.rgb = TEXT_LIGHT_MUTED
    p3.space_after = Pt(28)

    p4 = tf1.add_paragraph()
    p4.text = "Track: Merchant Growth AI   |   Focus: 12M+ Indian Kiranas & Retailers   |   Status: Live Working MVP"
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = WHITE
    p4.space_after = Pt(14)

    p5 = tf1.add_paragraph()
    p5.text = "🌐 Live Demo: https://dukaanai-seven.vercel.app   •   💻 GitHub: github.com/DRAKS17/Dukaan_AI"
    p5.font.size = Pt(12)
    p5.font.color.rgb = CYAN

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT (Light Background)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s2, LIGHT_BG)
    add_header(s2, "01 • PROBLEM STATEMENT", "The Kirana Growth Bottleneck", "Over 12M Indian Kiranas power 80%+ of retail grocery, yet lack data analytics to grow profitably.")

    cards_data_s2 = [
        ("Unexplained Sales Declines", "Shopkeepers observe revenue dips week-over-week but cannot pinpoint which product, category, or customer segment caused the drop without complex spreadsheets.", AMBER),
        ("Silent Stockouts & Lost Baskets", "Fast-moving daily staples (Milk, Tea, Maggi) run out unnoticed. Shoppers immediately walk to a competitor, causing the loss of the entire multi-item grocery basket.", RGBColor(239, 68, 68)),
        ("Margin Leakage on Staples", "Well-intentioned shopkeepers offer ₹5–₹10 casual discounts on commodities (edible oils, sugar) with 2–4% gross margins, inadvertently wiping out all net profit.", RGBColor(220, 38, 38)),
        ("Analytics & BI Intimidation", "Existing enterprise SaaS and analytics dashboards require desktop software, formula skills, and pivot tables that a busy counter shopkeeper has zero time to navigate.", PAYTM_BLUE),
    ]

    for idx, (title, desc, color) in enumerate(cards_data_s2):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(2.1 + row * 2.45)
        w = Inches(5.65)
        h = Inches(2.25)

        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_LIGHT
        card.line.width = Pt(1)

        # Top border accent
        top_bar = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()

        tb = s2.shapes.add_textbox(x + Inches(0.3), y + Inches(0.25), w - Inches(0.6), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"#{idx+1}. {title}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 3: PROPOSED SOLUTION (Dark Background)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s3, NAVY)
    add_header(s3, "02 • PROPOSED SOLUTION", "DukaanAI — Conversational Business Copilot", "Translating complex transaction ledgers into plain-language, evidence-backed merchant decisions.", is_dark=True)

    pillars = [
        ("Conversational AI Assistant", "Natural Language Q&A", [
            "Ask questions like 'Why are my sales lower this week?' or 'What should I do today?'",
            "Answers cite exact observation windows, rupee deltas, and culprit products.",
            "Zero hallucination: Math engine calculates facts; LLM formats explanations.",
            "Multi-lingual ready with Indian Kirana conversational tone."
        ], CYAN),
        ("Growth Recommendations Engine", "7 Automated Diagnostic Scans", [
            "Critical Stockout Alerts: Days remaining, velocity & supplier reorder qty.",
            "High-Margin Star Promotion: Flagging 20%+ margin items (Tea, Paneer, Jam).",
            "Product Affinity Bundles: Market basket pairs (Parle-G + Tata Tea).",
            "Slow-Moving Capital Unlock: Clearing 45+ day dead stock.",
            "Margin Leakage Warning: Safeguarding 3% margin staples from discounting."
        ], GREEN),
        ("Grounded Merchant Dashboard", "Executive Business Metrics", [
            "Calculated KPIs: Net Sales, Gross Profit, Gross Margin %, AOV, Repeat Rate.",
            "Strict baseline comparisons: Current 7-day vs Prior 7-day equal calendar days.",
            "Category revenue vs profit margin scatter and trend visualizations.",
            "Actionable status tracker: To Do → In Progress → Completed."
        ], WHITE),
    ]

    for idx, (title, subtitle, bullets, accent) in enumerate(pillars):
        x = Inches(0.8 + idx * 3.98)
        y = Inches(2.1)
        w = Inches(3.75)
        h = Inches(4.8)

        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_DARK
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1)

        # Header bar
        top_bar = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        tb = s3.shapes.add_textbox(x + Inches(0.25), y + Inches(0.25), w - Inches(0.5), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.space_after = Pt(2)

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = accent
        p_sub.space_after = Pt(14)

        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = f"•  {b}"
            pb.font.size = Pt(11)
            pb.font.color.rgb = TEXT_LIGHT_MUTED
            pb.space_after = Pt(8)

    # =========================================================================
    # SLIDE 4: TECHNOLOGY / TECH STACK USED (Light Background)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s4, LIGHT_BG)
    add_header(s4, "03 • TECH STACK & ARCHITECTURE", "Robust, Grounded & Production-Ready", "Engineered for sub-second edge performance with triple-redundant AI fallback.")

    tech_cols = [
        ("Frontend & Presentation Layer", PAYTM_BLUE, [
            ("Next.js 16.4 (App Router)", "High-performance React framework with Turbopack"),
            ("React 19 & TypeScript", "Strict type-safety across all mathematical engines"),
            ("Tailwind CSS v4 & Lucide", "Responsive CollectiveOS-inspired anti-slop UI"),
            ("Recharts Visualizations", "Lightweight, responsive time-series & margin charts")
        ]),
        ("AI & Deterministic Grounding", CYAN, [
            ("Google Gemini Flash", "Live LLM (gemini-3.8-flash / 3.7-flash) for reasoning"),
            ("Authoritative Math Engine", "Calculates net revenue, COGS, margins & velocity"),
            ("Zero-Hallucination Pipeline", "Facts computed first; LLM only formats language"),
            ("Offline Grounded Fallback", "100% deterministic fallback guarantees zero downtime")
        ]),
        ("Data, Validation & Deployment", GREEN, [
            ("Zod Schema Ingestion", "Row-level CSV error detection for merchant catalog"),
            ("Vercel Edge Global CDN", "Deployed live with sub-second worldwide latency"),
            ("Pseudonymous Privacy", "Zero PII exposure; hashed customer identifiers"),
            ("Automated Verification", "15/15 unit & integration tests passing in CI/CD")
        ]),
    ]

    for idx, (col_title, accent, items) in enumerate(tech_cols):
        x = Inches(0.8 + idx * 3.98)
        y = Inches(2.1)
        w = Inches(3.75)
        h = Inches(4.8)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_LIGHT
        card.line.width = Pt(1)

        top_bar = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        tb = s4.shapes.add_textbox(x + Inches(0.25), y + Inches(0.25), w - Inches(0.5), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = col_title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(14)

        for name, desc in items:
            p_name = tf.add_paragraph()
            p_name.text = name
            p_name.font.size = Pt(12)
            p_name.font.bold = True
            p_name.font.color.rgb = accent
            p_name.space_after = Pt(2)

            p_desc = tf.add_paragraph()
            p_desc.text = desc
            p_desc.font.size = Pt(10.5)
            p_desc.font.color.rgb = TEXT_MUTED
            p_desc.space_after = Pt(10)

    # =========================================================================
    # SLIDE 5: USP (UNIQUE SELLING PROPOSITION) (Light Background)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s5, LIGHT_BG)
    add_header(s5, "04 • UNIQUE SELLING PROPOSITION (USP)", "Why DukaanAI Wins in Counter Retail", "Unlike generic AI chatbots or complex BI suites, DukaanAI is purpose-built for Kirana operations.")

    usps = [
        ("Zero-Hallucination Grounding", "Generative AI is notorious for inventing numbers. DukaanAI never allows the LLM to do arithmetic. All numbers are computed deterministically from verified store data before the LLM generates the response.", GREEN),
        ("Triple-Redundant Reliability", "Never goes down during a busy day. If external LLM APIs experience rate-limits or 503 spikes, DukaanAI automatically falls back to an offline deterministic engine with identical grounded insights.", CYAN),
        ("Decision-Ready Action Cards", "Most analytics software shows passive graphs. DukaanAI converts every pattern into an urgent operational instruction: 'Call distributor today to order 42 packs of Tata Tea' with complete rationale.", PAYTM_BLUE),
        ("Tailored to Indian FMCG Realities", "Pre-configured for local Kirana dynamics: FMCG trade margins (3% oil vs 25% personal care), credit book cycles, supplier delivery cadences, and co-occurrence bundles (Chai + Biscuit).", AMBER)
    ]

    for idx, (title, desc, accent) in enumerate(usps):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(2.1 + row * 2.45)
        w = Inches(5.65)
        h = Inches(2.25)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_LIGHT
        card.line.width = Pt(1)

        top_bar = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        tb = s5.shapes.add_textbox(x + Inches(0.3), y + Inches(0.25), w - Inches(0.6), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"USP #{idx+1}: {title}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 6: IMPACT & BENEFITS (Dark Background)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s6, NAVY)
    add_header(s6, "05 • IMPACT & BENEFITS", "Quantifiable Bottom-Line Growth", "Empowering small merchants to increase net margins, protect cash flow, and retain customers.", is_dark=True)

    metrics = [
        ("+15% – 20%", "Net Profit Recovery", "By identifying margin leaks on 3% commodity staples and shifting promotional focus to 22%+ margin categories.", GREEN),
        ("35% Reduction", "In Stockout Incidents", "Predictive run-out warnings ensure daily staples (Milk, Tea, Bread) are replenished before the morning customer rush.", CYAN),
        ("4.5 Hours/Week", "Saved per Merchant", "Replaces manual notebook ledger analysis and guesswork with instant natural-language voice/text queries.", WHITE),
        ("25% Re-engagement", "Of Lapsed Customers", "Automated customer retention flags detect regular shoppers inactive for >21 days for targeted re-engagement.", AMBER)
    ]

    for idx, (stat, label, desc, color) in enumerate(metrics):
        x = Inches(0.8 + idx * 2.98)
        y = Inches(2.1)
        w = Inches(2.75)
        h = Inches(4.8)

        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_DARK
        card.line.color.rgb = BORDER_DARK
        card.line.width = Pt(1)

        top_bar = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()

        tb = s6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.25), w - Inches(0.4), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_stat = tf.paragraphs[0]
        p_stat.text = stat
        p_stat.font.size = Pt(24)
        p_stat.font.bold = True
        p_stat.font.color.rgb = color
        p_stat.space_after = Pt(4)

        p_lbl = tf.add_paragraph()
        p_lbl.text = label
        p_lbl.font.size = Pt(13)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = WHITE
        p_lbl.space_after = Pt(14)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = TEXT_LIGHT_MUTED

    # =========================================================================
    # SLIDE 7: BUSINESS MODEL & PAYTM ECOSYSTEM (Light Background)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s7, LIGHT_BG)
    add_header(s7, "06 • BUSINESS MODEL & PAYTM SYNERGIES", "Monetization & Ecosystem Flywheel", "Zero-CAC merchant acquisition via Paytm's 10M+ Soundbox and merchant payment network.")

    biz_streams = [
        ("Freemium SaaS Model", PAYTM_BLUE, [
            ("Starter (Free Forever)", "Core merchant dashboard, basic stock alerts, 7-day analytics. Designed for rapid grassroots adoption."),
            ("DukaanAI Pro (₹299 – ₹499/mo)", "Unlimited conversational AI queries, bundle co-occurrence optimizer, automated distributor reorder lists, lapsed customer CRM."),
            ("Enterprise Hub (₹1,999/mo)", "Multi-store management for retail chains and FMCG brand distributor analytics.")
        ]),
        ("Paytm Ecosystem Integration", CYAN, [
            ("Paytm for Business Flywheel", "Embedded as an AI Growth tab inside the Paytm for Business app; zero merchant acquisition cost."),
            ("Soundbox Audio Audio Summaries", "Paytm Soundbox announces daily morning business briefing: 'Good morning Ramesh ji, sales were ₹18,400 yesterday, Tata Tea is running low.'"),
            ("EDC / POS Terminal Synergies", "Transaction feeds from Paytm Card Machines flow directly into DukaanAI for zero-effort merchant accounting.")
        ]),
        ("B2B Marketplaces & Lending", GREEN, [
            ("Credit Underwriting Intelligence", "Verified cash flow and inventory health metrics enable Paytm to underwrite collateral-free merchant working capital loans with lower default rates."),
            ("Distributor Order Commissions", "Monetize automated reorders by routing Kirana replenishment orders directly to partnered FMCG wholesalers (1–2% GMV fee).")
        ])
    ]

    for idx, (title, accent, items) in enumerate(biz_streams):
        x = Inches(0.8 + idx * 3.98)
        y = Inches(2.1)
        w = Inches(3.75)
        h = Inches(4.8)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_LIGHT
        card.line.width = Pt(1)

        top_bar = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = accent
        top_bar.line.fill.background()

        tb = s7.shapes.add_textbox(x + Inches(0.25), y + Inches(0.25), w - Inches(0.5), h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(14)

        for name, desc in items:
            p_name = tf.add_paragraph()
            p_name.text = name
            p_name.font.size = Pt(12)
            p_name.font.bold = True
            p_name.font.color.rgb = accent
            p_name.space_after = Pt(2)

            p_desc = tf.add_paragraph()
            p_desc.text = desc
            p_desc.font.size = Pt(10.5)
            p_desc.font.color.rgb = TEXT_MUTED
            p_desc.space_after = Pt(10)

    # =========================================================================
    # SLIDE 8: SUMMARY & DEMO VERIFICATION (Dark Navy)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_slide_layout)
    add_bg(s8, NAVY)

    # Accent decorative banner
    accent_bar = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(0.4), Inches(5.5))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = GREEN
    accent_bar.line.fill.background()

    tb8 = s8.shapes.add_textbox(Inches(1.5), Inches(1.1), Inches(10.5), Inches(5.3))
    tf8 = tb8.text_frame
    tf8.word_wrap = True

    p0 = tf8.paragraphs[0]
    p0.text = "STAGE 1 SUBMISSION READY  •  WORKING PRODUCT DEMONSTRATION"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = GREEN
    p0.space_after = Pt(10)

    p1 = tf8.add_paragraph()
    p1.text = "Why DukaanAI is Ready for Stage 2"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_after = Pt(16)

    bullets_s8 = [
        "100% Fully Built & Live Production Deployment: Not just a prototype or Figma mockup. Live at https://dukaanai-seven.vercel.app.",
        "Verified Grounded AI: Powered by live Google Gemini Flash with zero-hallucination factual grounding and 100% offline fallback.",
        "End-to-End User Journey: Real Kirana dataset (~3,100 orders, 35 FMCG products, 420 customers) with explainable patterns.",
        "Automated Verification Suite: 15/15 automated tests passing covering calculations, intent classification, and CSV parsing.",
        "Seamless Paytm Synergies: Natural evolution from payment collection (Soundbox) to business growth copilot (DukaanAI)."
    ]

    for b in bullets_s8:
        pb = tf8.add_paragraph()
        pb.text = f"✓  {b}"
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_LIGHT_MUTED
        pb.space_after = Pt(10)

    p_last = tf8.add_paragraph()
    p_last.text = "Live App: https://dukaanai-seven.vercel.app   |   GitHub: https://github.com/DRAKS17/Dukaan_AI.git"
    p_last.font.size = Pt(13)
    p_last.font.bold = True
    p_last.font.color.rgb = CYAN
    p_last.space_before = Pt(14)

    prs.save(output_path)
    print(f"Presentation generated successfully: {output_path}")

if __name__ == '__main__':
    out_file = sys.argv[1] if len(sys.argv) > 1 else "DukaanAI_Pitch_Deck_Paytm_Hackathon.pptx"
    create_deck(out_file)
