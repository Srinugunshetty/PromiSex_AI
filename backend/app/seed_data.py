import uuid
from app.models.database import db
from app.models.schemas import PromiseStatus, ClaimCategory, EvidenceCitation

SAMPLE_LISTING_TEXT = """
TechCorp UltraBook Pro 15 (2026 AI Edition) - 15.6" 2.8K 120Hz OLED, Intel Core i7-13700H, 16GB DDR5, 1TB SSD, RTX 4060, Windows 11 Pro

Product Highlights & Seller Commitments:
• Intel Core i7-13700H 14-Core Processor (Up to 5.0 GHz Turbo with AI Boost)
• 16 GB Dual-Channel DDR5 5200MHz High-Speed RAM
• 1 TB PCIe Gen 4.0 NVMe M.2 Solid State Drive
• 12 Hours All-Day Long Battery Life with 75Wh capacity
• 100W GaN Ultra-Fast USB-C Charger included in box
• 15.6-inch 2.8K (2880x1800) 120Hz 100% DCI-P3 OLED Display
• NVIDIA GeForce RTX 4060 8GB GDDR6 Graphics Card (105W Max TGP)
• 2-Year Comprehensive International Onsite Manufacturer Warranty
• Aerospace-Grade CNC Aluminum Alloy Chassis with MIL-STD 810H Military Spec
• Genuine Microsoft Windows 11 Pro Pre-installed
• Dual Thunderbolt 4 Ports (40Gbps data & 100W Power Delivery)
• Wi-Fi 6E (802.11ax Tri-Band) and Bluetooth 5.3 Wireless
• 1080p FHD IR Webcam with Privacy Shutter and Windows Hello
• 24/7 Dedicated Priority Customer VIP Support Concierge
"""

SAMPLE_MANUFACTURER_SPEC = """
TechCorp UltraBook Pro 15 (Model UP15-2026-X)
Official Manufacturer Engineering Specification Datasheet - Rev 2.4

1. PROCESSOR & CHIPSET
- CPU: 13th Gen Intel Core i7-13700H (14 Cores: 6 Performance + 8 Efficient, 20 Threads, Max Turbo Frequency up to 5.00 GHz, 24MB Intel Smart Cache, 45W Base TDP).
- Architecture: Intel Raptor Lake AI Architecture.

2. SYSTEM MEMORY & STORAGE
- RAM: 16 GB DDR5 5200MHz Dual-Channel (2x 8GB SO-DIMM slots, user expandable to 64GB).
- Storage: 1 TB PCIe 4.0 x4 M.2 NVMe SSD (Read up to 7,000 MB/s, Write up to 5,500 MB/s). Secondary M.2 2280 PCIe 4.0 slot available.

3. DISPLAY SYSTEM
- Screen Size: 15.6-inch Active Matrix OLED.
- Resolution: 2.8K (2880 x 1800 pixels), 16:10 aspect ratio.
- Refresh Rate: 120Hz VRR (Variable Refresh Rate).
- Color Gamut: 100% DCI-P3 color coverage (Delta E < 1.0 calibrated), VESA DisplayHDR True Black 600 certified.

4. GRAPHICS
- Dedicated GPU: NVIDIA GeForce RTX 4060 Laptop GPU, 8GB GDDR6 VRAM, 105W Maximum Graphics Power with Dynamic Boost.

5. POWER & BATTERY SUBSYSTEM
- Battery Capacity: 75 Wh 4-Cell Lithium-Polymer.
- Official Battery Benchmark: Tested under MobileMark 25 productivity test at 150 nits brightness: Maximum runtime reaches up to 8.5 Hours. Continuous web browsing battery runtime: 7.2 Hours. High-performance gaming/rendering runtime: 1.8 Hours.
- In-Box Power Supply: Standard 65W USB Type-C Power Adapter (Input 100-240V). Note: Optional 100W GaN Quick Charger is sold separately as accessory SKU TC-ACC-100W.

6. PORTS & CONNECTIVITY
- I/O Ports: 2x Thunderbolt 4 Type-C (Supports DisplayPort 1.4, USB4 40Gbps, Power Delivery 3.0 up to 100W input), 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1 FRL port, 1x 3.5mm combo audio jack, 1x MicroSD Express card reader.
- Wireless: Intel Killer Wi-Fi 6E AX1675i (802.11ax 2x2 160MHz) + Bluetooth 5.3.

7. MECHANICAL & CHASSIS
- Construction: Precision CNC-machined 6000-series Anodized Aluminum Alloy unibody.
- Dimensions: 356 x 248 x 17.9 mm. Weight: 1.88 kg.
- Certification Notice: This consumer edition model has not undergone MIL-STD 810H military drop/shock certification. Military certification is restricted to Enterprise RuggedBook models.

8. OPERATING SYSTEM & SECURITY
- Pre-loaded OS: Windows 11 Pro 64-bit Edition with OEM digital license.
- Camera: 1080p FHD IR camera with physical privacy shutter, Windows Hello facial biometric authentication.
"""

SAMPLE_WARRANTY_DOC = """
TechCorp Global Hardware Warranty Terms & Support Policy (2026 Edition)

Section 1: Limited Warranty Scope
TechCorp Corporation warrants all new consumer portable computer hardware against defects in materials and workmanship under normal consumer use for a period of ONE (1) YEAR from the original retail purchase date ('Standard Limited Warranty Period').

Section 2: Extended & Merchant Warranties
Any representation by retailers, merchants, or third-party marketplaces offering warranty coverage in excess of ONE (1) YEAR (including advertised '2-Year' or '3-Year' comprehensive warranties) constitutes an independent merchant warranty or third-party insurance agreement. TechCorp is not liable for merchant warranty obligations unless a verified TechCorp CarePack+ registration certificate has been issued and registered in the TechCorp warranty database.

Section 3: Technical Support Service Levels
Standard TechCorp customer support is available Monday through Friday between 9:00 AM and 5:00 PM EST via online ticketing and webchat. 24/7 dedicated telephone concierge VIP priority support is exclusive to Enterprise Commercial Fleet accounts with active Premier Care contracts.
"""

SAMPLE_CUSTOMER_INVOICE = """
ORDER INVOICE & DELIVERY SPECIFICATION REPORT
Order Number: PX-89421
Customer Name: Sarah Jenkins
Delivery Date: 2026-11-15
Merchant: TechDirect Global
Courier: FedGlobal Express (Tracking: FDX-99214028)

PACKAGING BILL OF MATERIALS (BOM) & DIAGNOSTIC SCAN:
Item 1: TechCorp UltraBook Pro 15 (SN: UP15-99482)
- Installed Processor: Intel Core i7-13700H @ 2.40GHz (14 Cores) [CONFIRMED]
- Installed Memory: 1x 8 GB DDR5 4800MHz Micron Single Module (Slot 2 EMPTY) [CRITICAL MISMATCH]
- Installed Storage: 1 TB PCIe 4.0 NVMe SSD (Samsung PM9A1) [CONFIRMED]
- Display Panel: 15.6" Samsung OLED 2.8K 120Hz [CONFIRMED]
- Power Brick In Box: TechCorp 65W Standard Type-C Adapter (Model AD65W) [ACCESSORY MISMATCH - 100W GaN Promised]
- Warranty Documentation: 1-Year Standard TechCorp Warranty Pamphlet. (No 2-Year VIP certificate enclosed).
"""

def seed_database():
    """Initializes the database with pre-built jury-ready scenario."""
    # Check if already seeded
    existing = db.get_product("prod_ultrabook_15")
    if existing and len(existing.get("claims", [])) >= 10:
        return

    # 1. Product
    product_id = "prod_ultrabook_15"
    seller_id = "seller_techdirect"
    
    prod_data = {
        "id": product_id,
        "title": "TechCorp UltraBook Pro 15 (Flagship AI Edition)",
        "brand": "TechCorp",
        "model": "UP15-2026-X",
        "seller_id": seller_id,
        "seller_name": "TechDirect Global",
        "price": 1499.00,
        "currency": "USD",
        "category": "Laptops",
        "raw_listing_text": SAMPLE_LISTING_TEXT,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        "created_at": "2026-11-10T10:00:00Z",
        "stats": {
            "total_claims": 14,
            "verified": 9,
            "partially_verified": 2,
            "contradicted": 2,
            "unverifiable": 1,
            "trust_score": 74.2
        }
    }
    db.save_product(prod_data)

    # 2. Seller
    seller_data = {
        "id": seller_id,
        "name": "TechDirect Global",
        "rating": 4.2,
        "total_orders": 2480,
        "total_products": 38,
        "trust_score": 78.4,
        "risk_level": "Moderate",
        "contradiction_rate": 16.5,
        "recurring_issues": [
            "Battery runtime overstatement",
            "In-box charger wattage downgrades",
            "Third-party extended warranty ambiguity"
        ],
        "recent_discrepancies": 6
    }
    db.save_seller(seller_data)

    # 3. Evidence Documents
    doc1 = {
        "id": "doc_techcorp_spec",
        "product_id": product_id,
        "title": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
        "doc_type": "manufacturer_spec",
        "filename": "ultrabook_pro_spec_datasheet.pdf",
        "text_content": SAMPLE_MANUFACTURER_SPEC,
        "created_at": "2026-11-10T10:05:00Z"
    }
    doc2 = {
        "id": "doc_techcorp_warranty",
        "product_id": product_id,
        "title": "TechCorp Global Hardware Warranty Terms & Support Policy",
        "doc_type": "warranty_policy",
        "filename": "techcorp_warranty_terms.pdf",
        "text_content": SAMPLE_WARRANTY_DOC,
        "created_at": "2026-11-10T10:06:00Z"
    }
    db.save_evidence_doc(doc1)
    db.save_evidence_doc(doc2)

    # 4. Structured Claims with reconciled evidence
    claims_data = [
        {
            "id": "clm_cpu",
            "product_id": product_id,
            "claim_text": "Intel Core i7-13700H 14-Core Processor (Up to 5.0 GHz Turbo with AI Boost)",
            "category": ClaimCategory.PERFORMANCE.value,
            "metric": "Processor / CPU",
            "promised_value": "Intel Core i7-13700H",
            "unit": "GHz",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.98,
            "verified_value": "Intel Core i7-13700H (14 Cores: 6P+8E, up to 5.0GHz)",
            "explanation": "Verified: Claim is confirmed by manufacturer datasheet (Section 1: Processor & Chipset). Exact clock speeds and 14-core topology match.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "1. PROCESSOR & CHIPSET",
                    "page": 1,
                    "snippet": "CPU: 13th Gen Intel Core i7-13700H (14 Cores: 6 Performance + 8 Efficient, 20 Threads, Max Turbo Frequency up to 5.00 GHz, 24MB Intel Smart Cache, 45W Base TDP).",
                    "relevance_score": 0.98
                }
            ]
        },
        {
            "id": "clm_ram",
            "product_id": product_id,
            "claim_text": "16 GB Dual-Channel DDR5 5200MHz High-Speed RAM",
            "category": ClaimCategory.MEMORY_STORAGE.value,
            "metric": "System RAM",
            "promised_value": "16 GB DDR5",
            "unit": "GB",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.97,
            "verified_value": "16 GB DDR5 5200MHz (2x 8GB SO-DIMM)",
            "explanation": "Verified: Manufacturer datasheet (Section 2: Memory & Storage) confirms 16 GB DDR5 5200MHz dual-channel memory configuration.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "2. SYSTEM MEMORY & STORAGE",
                    "page": 1,
                    "snippet": "RAM: 16 GB DDR5 5200MHz Dual-Channel (2x 8GB SO-DIMM slots, user expandable to 64GB).",
                    "relevance_score": 0.97
                }
            ]
        },
        {
            "id": "clm_ssd",
            "product_id": product_id,
            "claim_text": "1 TB PCIe Gen 4.0 NVMe M.2 Solid State Drive",
            "category": ClaimCategory.MEMORY_STORAGE.value,
            "metric": "Storage Capacity",
            "promised_value": "1 TB NVMe SSD",
            "unit": "TB",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.96,
            "verified_value": "1 TB PCIe 4.0 x4 M.2 NVMe SSD",
            "explanation": "Verified: Confirmed in manufacturer technical spec sheet Section 2.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "2. SYSTEM MEMORY & STORAGE",
                    "page": 1,
                    "snippet": "Storage: 1 TB PCIe 4.0 x4 M.2 NVMe SSD (Read up to 7,000 MB/s, Write up to 5,500 MB/s).",
                    "relevance_score": 0.96
                }
            ]
        },
        {
            "id": "clm_battery",
            "product_id": product_id,
            "claim_text": "12 Hours All-Day Long Battery Life with 75Wh capacity",
            "category": ClaimCategory.BATTERY_POWER.value,
            "metric": "Battery Life",
            "promised_value": "12 Hours",
            "unit": "Hours",
            "status": PromiseStatus.CONTRADICTED.value,
            "confidence": 0.96,
            "verified_value": "8.5 Hours Max (MobileMark 25)",
            "explanation": "Direct Contradiction: Official TechCorp engineering datasheet (Section 5: Power & Battery) specifies maximum runtime of up to 8.5 hours under standard MobileMark 25 benchmarks. The listing's claim of 12 hours exaggerates runtime by 41%.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "5. POWER & BATTERY SUBSYSTEM",
                    "page": 1,
                    "snippet": "Official Battery Benchmark: Tested under MobileMark 25 productivity test at 150 nits brightness: Maximum runtime reaches up to 8.5 Hours. Continuous web browsing battery runtime: 7.2 Hours.",
                    "relevance_score": 0.95
                }
            ]
        },
        {
            "id": "clm_charger",
            "product_id": product_id,
            "claim_text": "100W GaN Ultra-Fast USB-C Charger included in box",
            "category": ClaimCategory.BATTERY_POWER.value,
            "metric": "Charger In-Box",
            "promised_value": "100W GaN Fast Charger",
            "unit": "Watts",
            "status": PromiseStatus.CONTRADICTED.value,
            "confidence": 0.95,
            "verified_value": "65W Standard Type-C Adapter",
            "explanation": "Direct Contradiction: Manufacturer packaging manifest explicitly notes standard in-box adapter is 65W. The 100W GaN unit is an optional aftermarket accessory sold separately.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "5. POWER & BATTERY SUBSYSTEM",
                    "page": 1,
                    "snippet": "In-Box Power Supply: Standard 65W USB Type-C Power Adapter (Input 100-240V). Note: Optional 100W GaN Quick Charger is sold separately as accessory SKU TC-ACC-100W.",
                    "relevance_score": 0.94
                }
            ]
        },
        {
            "id": "clm_display",
            "product_id": product_id,
            "claim_text": "15.6-inch 2.8K (2880x1800) 120Hz 100% DCI-P3 OLED Display",
            "category": ClaimCategory.DISPLAY.value,
            "metric": "Display Panel",
            "promised_value": "2.8K 120Hz OLED",
            "unit": "Resolution/Hz",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.97,
            "verified_value": "15.6\" 2.8K (2880x1800) OLED 120Hz",
            "explanation": "Verified: Panel specifications match manufacturer datasheet Section 3.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "3. DISPLAY SYSTEM",
                    "page": 1,
                    "snippet": "Screen Size: 15.6-inch Active Matrix OLED. Resolution: 2.8K (2880 x 1800 pixels), 16:10 aspect ratio. Refresh Rate: 120Hz VRR. Color Gamut: 100% DCI-P3.",
                    "relevance_score": 0.97
                }
            ]
        },
        {
            "id": "clm_gpu",
            "product_id": product_id,
            "claim_text": "NVIDIA GeForce RTX 4060 8GB GDDR6 Graphics Card (105W Max TGP)",
            "category": ClaimCategory.PERFORMANCE.value,
            "metric": "Dedicated GPU",
            "promised_value": "RTX 4060 8GB 105W",
            "unit": "GB VRAM",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.98,
            "verified_value": "NVIDIA GeForce RTX 4060 8GB GDDR6 105W",
            "explanation": "Verified: Official spec datasheet Section 4 confirms RTX 4060 8GB at 105W TGP.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "4. GRAPHICS",
                    "page": 1,
                    "snippet": "Dedicated GPU: NVIDIA GeForce RTX 4060 Laptop GPU, 8GB GDDR6 VRAM, 105W Maximum Graphics Power with Dynamic Boost.",
                    "relevance_score": 0.98
                }
            ]
        },
        {
            "id": "clm_warranty",
            "product_id": product_id,
            "claim_text": "2-Year Comprehensive International Onsite Manufacturer Warranty",
            "category": ClaimCategory.WARRANTY_SERVICE.value,
            "metric": "Warranty Duration",
            "promised_value": "2 Years Comprehensive",
            "unit": "Years",
            "status": PromiseStatus.PARTIALLY_VERIFIED.value,
            "confidence": 0.93,
            "verified_value": "1 Year Manufacturer (2nd Year Unverified Merchant Addon)",
            "explanation": "Partially Verified: TechCorp official warranty policy provides 1-Year Limited Manufacturer Warranty. The advertised 2nd year is an aftermarket merchant claim requiring external third-party registration.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp Global Hardware Warranty Terms & Support Policy",
                    "doc_type": "warranty_policy",
                    "section": "Section 1 & 2: Limited Warranty Scope",
                    "page": 1,
                    "snippet": "TechCorp warrants all new consumer portable computer hardware against defects for a period of ONE (1) YEAR... Any representation offering warranty in excess of ONE (1) YEAR constitutes an independent merchant warranty.",
                    "relevance_score": 0.93
                }
            ]
        },
        {
            "id": "clm_chassis",
            "product_id": product_id,
            "claim_text": "Aerospace-Grade CNC Aluminum Alloy Chassis with MIL-STD 810H Military Spec",
            "category": ClaimCategory.BUILD_MATERIALS.value,
            "metric": "Chassis Durability",
            "promised_value": "MIL-STD 810H Aluminum",
            "unit": "Standard",
            "status": PromiseStatus.UNVERIFIABLE.value,
            "confidence": 0.88,
            "verified_value": "CNC Aluminum (MIL-STD Not Certified)",
            "explanation": "Unverifiable / Unsupported: Official datasheet confirms CNC aluminum alloy body, but Section 7 specifically states that MIL-STD 810H military shock/drop testing is NOT certified for this consumer SKU.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "7. MECHANICAL & CHASSIS",
                    "page": 1,
                    "snippet": "Construction: Precision CNC-machined 6000-series Anodized Aluminum Alloy unibody. Certification Notice: This consumer edition model has not undergone MIL-STD 810H military drop/shock certification.",
                    "relevance_score": 0.89
                }
            ]
        },
        {
            "id": "clm_os",
            "product_id": product_id,
            "claim_text": "Genuine Microsoft Windows 11 Pro Pre-installed",
            "category": ClaimCategory.SOFTWARE_OS.value,
            "metric": "Operating System",
            "promised_value": "Windows 11 Pro",
            "unit": "OS",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.96,
            "verified_value": "Windows 11 Pro 64-bit Edition",
            "explanation": "Verified: Section 8 confirms Windows 11 Pro OEM digital license pre-installed.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "8. OPERATING SYSTEM & SECURITY",
                    "page": 1,
                    "snippet": "Pre-loaded OS: Windows 11 Pro 64-bit Edition with OEM digital license.",
                    "relevance_score": 0.96
                }
            ]
        },
        {
            "id": "clm_tb4",
            "product_id": product_id,
            "claim_text": "Dual Thunderbolt 4 Ports (40Gbps data & 100W Power Delivery)",
            "category": ClaimCategory.CONNECTIVITY.value,
            "metric": "Thunderbolt Ports",
            "promised_value": "Dual Thunderbolt 4",
            "unit": "Port",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.95,
            "verified_value": "2x Thunderbolt 4 Type-C (40Gbps, PD 3.0)",
            "explanation": "Verified: Confirmed in manufacturer technical spec Section 6.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "6. PORTS & CONNECTIVITY",
                    "page": 1,
                    "snippet": "I/O Ports: 2x Thunderbolt 4 Type-C (Supports DisplayPort 1.4, USB4 40Gbps, Power Delivery 3.0 up to 100W input).",
                    "relevance_score": 0.95
                }
            ]
        },
        {
            "id": "clm_wifi",
            "product_id": product_id,
            "claim_text": "Wi-Fi 6E (802.11ax Tri-Band) and Bluetooth 5.3 Wireless",
            "category": ClaimCategory.CONNECTIVITY.value,
            "metric": "Wireless Standard",
            "promised_value": "Wi-Fi 6E / BT 5.3",
            "unit": "Protocol",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.96,
            "verified_value": "Intel Killer Wi-Fi 6E AX1675i + BT 5.3",
            "explanation": "Verified: Matches official manufacturer wireless hardware manifest.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "6. PORTS & CONNECTIVITY",
                    "page": 1,
                    "snippet": "Wireless: Intel Killer Wi-Fi 6E AX1675i (802.11ax 2x2 160MHz) + Bluetooth 5.3.",
                    "relevance_score": 0.96
                }
            ]
        },
        {
            "id": "clm_webcam",
            "product_id": product_id,
            "claim_text": "1080p FHD IR Webcam with Privacy Shutter and Windows Hello",
            "category": ClaimCategory.ACCESSORIES.value,
            "metric": "Webcam & Biometrics",
            "promised_value": "1080p IR Windows Hello",
            "unit": "Biometric",
            "status": PromiseStatus.VERIFIED.value,
            "confidence": 0.97,
            "verified_value": "1080p FHD IR Camera with Privacy Shutter",
            "explanation": "Verified: Camera and biometric security confirmed in Section 8.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp UltraBook Pro 15 Official Engineering Spec Sheet (Rev 2.4)",
                    "doc_type": "manufacturer_spec",
                    "section": "8. OPERATING SYSTEM & SECURITY",
                    "page": 1,
                    "snippet": "Camera: 1080p FHD IR camera with physical privacy shutter, Windows Hello facial biometric authentication.",
                    "relevance_score": 0.97
                }
            ]
        },
        {
            "id": "clm_support",
            "product_id": product_id,
            "claim_text": "24/7 Dedicated Priority Customer VIP Support Concierge",
            "category": ClaimCategory.WARRANTY_SERVICE.value,
            "metric": "Support SLA",
            "promised_value": "24/7 VIP Concierge",
            "unit": "SLA",
            "status": PromiseStatus.PARTIALLY_VERIFIED.value,
            "confidence": 0.85,
            "verified_value": "Standard Hours (Mon-Fri 9-5 EST)",
            "explanation": "Partially Verified: TechCorp policy provides business-hours support (Mon-Fri 9-5 EST). 24/7 VIP concierge is reserved for enterprise fleet contracts.",
            "evidence_citations": [
                {
                    "source_name": "TechCorp Global Hardware Warranty Terms & Support Policy",
                    "doc_type": "warranty_policy",
                    "section": "Section 3: Technical Support Service Levels",
                    "page": 1,
                    "snippet": "Standard TechCorp customer support is available Monday through Friday between 9:00 AM and 5:00 PM EST via online ticketing. 24/7 dedicated telephone concierge VIP priority support is exclusive to Enterprise Commercial Fleet accounts.",
                    "relevance_score": 0.85
                }
            ]
        }
    ]
    db.save_claims(claims_data)

    # 5. Pre-seeded Delivery Order & Discrepancy Report
    order_id = "PX-89421"
    report_id = "REP-PX-89421"
    
    order_data = {
        "order_id": order_id,
        "product_id": product_id,
        "customer_name": "Sarah Jenkins",
        "delivery_date": "2026-11-15",
        "status": "Discrepancy Reported",
        "report_id": report_id,
        "discrepancies_count": 3,
        "severity": "Critical"
    }
    db.save_order(order_data)

    discrepancy_report_data = {
        "id": report_id,
        "order_id": order_id,
        "product_id": product_id,
        "product_title": "TechCorp UltraBook Pro 15 (Flagship AI Edition)",
        "seller_name": "TechDirect Global",
        "customer_name": "Sarah Jenkins",
        "generated_at": "2026-11-15T14:30:00Z",
        "severity": "Critical",
        "summary": "Automated post-purchase verification detected 3 severe non-conformances between seller commitments and delivered product hardware.",
        "items": [
            {
                "claim_id": "clm_ram",
                "claim_text": "16 GB Dual-Channel DDR5 5200MHz High-Speed RAM",
                "promised_value": "16 GB DDR5 Dual-Channel",
                "delivered_value": "8 GB DDR5 Micron Single Module Installed",
                "discrepancy_type": "Hardware Downgrade",
                "severity": "Critical",
                "impact": "50% reduction in system memory capacity; memory running in single-channel bottleneck mode."
            },
            {
                "claim_id": "clm_charger",
                "claim_text": "100W GaN Ultra-Fast USB-C Charger included in box",
                "promised_value": "100W GaN Fast Charger",
                "delivered_value": "65W Standard Type-C Power Adapter (Model AD65W)",
                "discrepancy_type": "Accessory Mismatch",
                "severity": "Medium",
                "impact": "Device charging speed reduced by 35W; power throttling occurs when GPU is under load."
            },
            {
                "claim_id": "clm_warranty",
                "claim_text": "2-Year Comprehensive International Onsite Manufacturer Warranty",
                "promised_value": "2 Years Comprehensive Onsite",
                "delivered_value": "1-Year Standard Limited Warranty Card (No 2nd-Year Policy Enclosed)",
                "discrepancy_type": "Warranty Shortfall",
                "severity": "High",
                "impact": "Customer denied second-year warranty entitlement without proof of external insurance policy."
            }
        ],
        "evidence_proof": "Verified against Customer Delivery Invoice #PX-89421 & Diagnostic System Report. Timestamp: 2026-11-15 14:30:22 UTC.",
        "recommended_action": (
            "1. Option A (Expedited Remedy): Courier dispatch of complementary 8GB DDR5 SO-DIMM module + 100W GaN charger within 48h.\n"
            "2. Option B (Cash Settlement): Credit partial refund of $160.00 to buyer payment method.\n"
            "3. Option C (Immediate Return): Issue prepaid return label for 100% full refund with expedited restocking."
        ),
        "status": "Under Seller Dispute Review"
    }
    db.save_discrepancy_report(discrepancy_report_data)

    print("[SeedData] Successfully initialized PROMISEX AI database with Jury-Winning Laptop Scenario!")
