#!/usr/bin/env python3
"""Emit static pages for cascadedoula.com. Run from repo root."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
T = json.loads((ROOT / "scripts" / "testimonials.json").read_text())

NAV = [
    ("/", "home", False),
    ("/about/", "meet nicole", True),
    ("/services/", "services", True),
    ("/testimonials/", "testimonials", True),
    ("/services-packages/", "birth doula", True),
    ("/resources-for-mamas/", "resources for mamas", True),
    ("/consultation/", "consultation", True),
    ("/body-ready-method/", "body ready method", True),
    ("/creative-funding/", "creative funding", True),
    ("/contact/", "contact", True),
]


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def page(path: str, title: str, desc: str, body: str, head="on-light", extra_head="", body_class=""):
    items = []
    for href, label, show in NAV:
        if not show:
            continue
        cur = ' aria-current="page"' if href == path else ""
        items.append(f'<a href="{href}"{cur}>{esc(label)}</a>')
    nav = "\n        ".join(items)
    ig = '''<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>'''
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="https://www.cascadedoula.com{path}">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
{extra_head}
</head>
<body class="{body_class}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-head {head}">
  <div class="head-in">
    <span></span>
    <a class="brand" href="/">Cascade Doula Care</a>
    <div class="head-right">
      <a class="ig" href="https://www.instagram.com/doulanicolelakey/" target="_blank" rel="noopener" aria-label="Instagram">{ig}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="navPanel" aria-label="Open menu">
        <span></span><span></span>
      </button>
      <div class="nav-panel" id="navPanel">
        <nav>{nav}</nav>
      </div>
    </div>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="site-foot">
  <div class="foot-in">
    <span>Cascade Doula Care</span>
    <a class="ig" href="https://www.instagram.com/doulanicolelakey/" target="_blank" rel="noopener" aria-label="Instagram">{ig}</a>
    <a class="email" href="mailto:cascadedoulanl@gmail.com">cascadedoulanl@gmail.com</a>
  </div>
</footer>
{FORM}
<script src="/assets/js/config.js"></script>
<script src="/assets/js/site.js"></script>
</body>
</html>
"""
    dest = ROOT / ("index.html" if path == "/" else path.strip("/") + "/index.html")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html)
    print("wrote", dest.relative_to(ROOT))


FORM = """
<div class="form-modal" id="contactModal">
  <form class="form-card" id="intakeForm">
    <h2>Contact Nicole</h2>
    <p>Leave a note and I will reach out. Nothing sends until you submit.</p>
    <div class="row">
      <div><label for="firstName">First name</label><input id="firstName" name="firstName" required></div>
      <div><label for="lastName">Last name</label><input id="lastName" name="lastName"></div>
    </div>
    <div class="row">
      <div><label for="email">Email</label><input id="email" name="email" type="email"></div>
      <div><label for="phone">Phone</label><input id="phone" name="phone" type="tel"></div>
    </div>
    <label for="dueDate">Estimated due date</label>
    <input id="dueDate" name="dueDate" type="date">
    <label for="provider">Who is your provider?</label>
    <input id="provider" name="provider">
    <label for="placeOfDelivery">Planned place of delivery?</label>
    <input id="placeOfDelivery" name="placeOfDelivery">
    <label for="about">Tell me about yourself</label>
    <textarea id="about" name="about" rows="4"></textarea>
    <p class="checks">
      <span>What are you looking for?</span>
      <label><input type="checkbox" name="looking" value="Birth Doula"> Birth Doula</label>
      <label><input type="checkbox" name="looking" value="One on One Virtual Support"> One on One Virtual Support</label>
      <label><input type="checkbox" name="looking" value="Childbirth Education Classes"> Childbirth Education Classes</label>
      <label><input type="checkbox" name="looking" value="Doula to Doula (Mentorship)"> Doula to Doula (Mentorship)</label>
    </p>
    <button type="submit">Submit</button>
    <button type="button" class="pill ghost" data-close-form style="margin-top:10px;width:100%">Close</button>
    <p class="form-msg" id="formMsg"></p>
  </form>
</div>
"""

DESC = "Unbiased birth and postpartum support for families in Scotts Valley, Santa Cruz, San Jose and surrounding areas."

page(
    "/",
    "Cascade Doula Care",
    DESC,
    """
<section class="band bg-blush">
  <div class="wrap">
    <div class="lines">
      <img class="line-side" src="/assets/img/line-1.png" alt="">
      <img class="line-center" src="/assets/img/line-2.png" alt="">
      <img class="line-side" src="/assets/img/line-3.png" alt="">
    </div>
    <p class="hero-copy">Providing unbiased, unwavering birth and postpartum support for birthing mothers and families in Scotts Valley, Santa Cruz, San Jose and surrounding areas.</p>
    <div class="photos-4">
      <figure><img src="/assets/img/photo-boardwalk.jpg" alt=""></figure>
      <figure><img src="/assets/img/photo-couple.jpg" alt=""></figure>
      <figure><img src="/assets/img/photo-garden.jpg" alt=""></figure>
      <figure><img src="/assets/img/photo-coast.jpg" alt=""></figure>
    </div>
  </div>
</section>
""",
    head="on-dark",
    body_class="home-page",
)

page(
    "/about/",
    "Meet Nicole · Cascade Doula Care",
    "Nicole Lakey is a birth doula and certified Body Ready Method Pro serving Santa Cruz, Scotts Valley and San Jose.",
    """
<section class="band bg-mauve">
  <div class="wrap about-grid">
    <div>
      <h1>Meet Nicole</h1>
      <p>After a 15-year career in the medical field, Nicole has followed her true passion for supporting families during the transformative process of childbirth. As a birth doula and a certified Body Ready Method® Pro, she has discovered her true calling: helping you feel strong, confident, and prepared in your own body.</p>
      <p>Nicole's work is driven by a deep belief that every person deserves to feel supported, informed, and empowered as they navigate pregnancy, birth, and the postpartum period. She brings a unique, hands-on approach to her care, bridging the gap between emotional encouragement and physical preparation. Through her certification in the Body Ready Method®, she helps families work with their bodies to create space for baby to engage and descend, leading to more comfortable pregnancies and efficient labors. She is also an expert in the use of the birth sling, providing loving, hands-on physical support throughout the intensity of labor.</p>
      <p>Whether preparing your body for birth or focusing on healing and recovery postpartum, Nicole's goal is simple: to remind you how powerful you are. She provides education and unbiased information to help families speak up and make the best decisions for themselves. Her easygoing, confident, and approachable personality, paired with a good sense of humor, helps put everyone at ease. Nicole works seamlessly alongside hospital staff, birth center teams, and home birth providers, viewing her role as a collaborative team member dedicated to creating a calm and supportive environment.</p>
      <p>When she's not supporting families, Nicole is at home with her husband and their three children, living out her belief that with the right support, you truly can thrive.</p>
    </div>
    <img src="/assets/img/nicole.jpg" alt="Nicole Lakey">
  </div>
</section>
<section class="band bg-plum-deep">
  <div class="wrap center narrow">
    <h2>Why work with A Doula?</h2>
    <p class="quote">A doula is a trained professional who provides support for the birthing mother and her birth partner during pregnancy, labor and delivery. A doula is a wonderful option both for first time parents or those who want to refresh their knowledge or enhance their skills for achieving their desired birth experience.</p>
    <p>They can also assist with clarifying your birth preferences and explaining the options available to you. Your doula can help guide you and your partner through all stages of labor, regardless of whether you choose to give birth at home, at a birth center, or in a hospital and provide support to help you feel safe, cope with early labor, manage pain during active labor, and stay with you until you meet your baby. Doulas often hear, "I looked over at you and you gave me a look that let me know that everything was okay." We keep an eye on the big picture and anticipate your next need. Always ready, always prepared.</p>
  </div>
</section>
""",
)

page(
    "/services/",
    "Services · Cascade Doula Care",
    "One-on-one support for expecting families, birth worker billing guidance, and a birth doula package.",
    """
<section class="band bg-mauve center">
  <div class="wrap">
    <h1>SERVICES</h1>
    <img class="floral" src="/assets/img/floral-mix.png" alt="">
  </div>
</section>
<section class="band bg-plum">
  <div class="wrap narrow center">
    <h2>One-on-One Support for Expecting Families</h2>
    <p class="quote">Empowered, Informed, and Supported Every Step of the Way</p>
    <p>Pregnancy is more than just preparing for birth. It is a journey filled with choices, emotions, and deep transformation. I offer personalized one-on-one sessions for birthing families who want to feel confident, grounded, and informed as they prepare to welcome their baby.</p>
    <p>In these private sessions, we'll focus on:</p>
    <ul class="ul-plain" style="text-align:left">
      <li><b>Childbirth Education.</b> Learn what to expect during labor and birth, understand your options, and gain tools for comfort, advocacy, and informed decision-making.</li>
      <li><b>Setting Birth Intentions.</b> Clarify your hopes, preferences, and values around birth. Together, we'll explore what matters most to you so you can feel empowered in any birthing environment.</li>
      <li><b>Emotional &amp; Mental Preparation.</b> Create space to release fears, build confidence, and prepare mentally and emotionally for the transition into parenthood.</li>
      <li><b>Partner Involvement.</b> Support your partner or support person in feeling prepared, connected, and ready to be an active part of the experience.</li>
    </ul>
    <p>Each session is tailored to meet your unique needs, questions, and vision for birth. Whether you're birthing at home, in a hospital, or a birth center, this is your space to learn, plan, and connect.</p>
    <p>Let's create a calm, empowered start to your birth journey.</p>
  </div>
</section>
<section class="band bg-plum-deep">
  <div class="wrap narrow center">
    <h2>Support for Birth Workers:</h2>
    <p class="quote">One-on-One Insurance Billing Guidance</p>
    <p>Are you a birth worker looking to expand your practice by offering services that are reimbursable through insurance, but don't know where to start? I offer personalized one-on-one support to help doulas and other perinatal professionals navigate the process of setting up and submitting insurance claims with confidence.</p>
    <p>Whether you're brand new to billing or looking to refine your current system, I'll guide you through:</p>
    <ul class="ul-plain" style="text-align:left">
      <li>Understanding what services can be billed</li>
      <li>Gathering and organizing the required documentation</li>
      <li>Setting up systems to streamline your billing process</li>
      <li>Navigating superbills, CPT codes, and ICD-10 codes</li>
      <li>Communicating effectively with clients and insurers</li>
    </ul>
    <p>This is not just about billing. It is about building a sustainable, professional practice that honors your time and expertise.</p>
  </div>
</section>
<section class="band bg-mauve">
  <div class="wrap narrow">
    <h2 class="center">Birth Doula Package</h2>
    <p class="center quote">My services are tailored to your specific needs, but a basic doula package will include the following services</p>
    <p class="center">Two 2-hour prenatal visits to assess your needs and desires for birth, provide useful tools for labor and birth for you to feel empowered and supported, as well as establish your postpartum plan</p>
    <ul class="ul-plain">
      <li>Help with any concerns and information about holistic and natural remedies to minor pregnancy discomforts</li>
      <li>Continuous physical, emotional, and informational support to you and your partner for the duration of labor and birth, to help you hold and move towards the vision you created for your baby's birth</li>
      <li>Initial breastfeeding support immediately after birth to help your baby latch on properly and encourage the establishment of breastfeeding</li>
      <li>Two postpartum follow-up visits to celebrate the birth of your baby and answer any questions you have during the early postpartum period. References to additional services including lactation consultants, meal delivery, placenta encapsulation, massage, chiropractic and acupuncture.</li>
      <li>Unlimited phone and chat support to answer your questions and offer suggestions and support throughout pregnancy and early labor</li>
      <li>Additional support such as extra visits or birth photography (for doula clients only) available. Ask me for more info.</li>
    </ul>
    <p><b>Nicole is contracted with Central California Alliance for Health, Medi-cal and offers private pay/sliding scale</b></p>
  </div>
</section>
""",
)

page(
    "/services-packages/",
    "Birth Doula · Cascade Doula Care",
    "Birth doula package for families in Santa Cruz, Scotts Valley and San Jose.",
    """
<section class="photo-hero">
  <img class="bg" src="/assets/img/photo-boardwalk.jpg" alt="">
  <div class="veil"></div>
  <div class="inner">
    <div class="grid-3">
      <div><h2>Connect</h2><p>Giving birth is one of the most important moments in your life, surround yourself with people who make you feel safe, strong, and supported.</p></div>
      <div><h2>Empower</h2><p>We'll discuss your wishes and work together to build a personalized birth blueprint, empowering you to greet this transformative event with confidence.</p></div>
      <div><h2>Prepare</h2><p>As your doula, I am here to provide you with education, and resources so you are prepared to advocate for the birth you want, and to support you through whatever your birth brings.</p></div>
    </div>
  </div>
</section>
<section class="band bg-mauve center">
  <div class="wrap">
    <h2>Birth Doula Package</h2>
    <img class="floral" src="/assets/img/floral-white.png" alt="">
    <p class="quote">My services are tailored to your specific needs, but a basic doula package will include the following services</p>
  </div>
</section>
<section class="band bg-plum">
  <div class="wrap narrow">
    <p>Two 2-hour prenatal visits to assess your needs and desires for birth, provide useful tools for labor and birth for you to feel empowered and supported, as well as establish your postpartum plan</p>
    <ul class="ul-plain">
      <li>Help with any concerns and information about holistic and natural remedies to minor pregnancy discomforts</li>
      <li>Continuous physical, emotional, and informational support to you and your partner for the duration of labor and birth</li>
      <li>Initial breastfeeding support immediately after birth</li>
      <li>Two postpartum follow-up visits, plus references to lactation, meals, placenta encapsulation, massage, chiropractic and acupuncture</li>
      <li>Unlimited phone and chat support throughout pregnancy and early labor</li>
      <li>Additional support such as extra visits or birth photography (for doula clients only) available</li>
    </ul>
    <p><b>Nicole is contracted with Central California Alliance for Health, Medi-cal and offers private pay/sliding scale</b></p>
  </div>
</section>
<section class="band bg-mauve">
  <div class="wrap">
    <h2>HOW IT WORKS</h2>
    <div class="grid-3">
      <div><h3>first!</h3><p>At your first prenatal appointment, we will go over your ideas for your labor, pain management, and assist you with developing a practical birth plan. The second prenatal we will explore a plan for early labor, make sure your bags are packed, practice comfort techniques, and go over any last-minute details. I can provide these prenatal sessions in person or virtually.</p></div>
      <div><h3>second!</h3><p>During your labor, I will provide position ideas and resources. I am there to remind you of your plans and goals and ensure you feel safe, heard, and respected. I'll also encourage your partner to eat, drink, and rest at appropriate times. I will never take the place of any other member of your support team. My job is to be a calming presence and a constant support.</p></div>
      <div><h3>third!</h3><p>After the newest addition to your family makes their appearance, I remain your person. As the attention shifts to the tiny new human in the room, my attention remains on you. I will stay with you and help to support you during your Golden Hour of skin to skin with your new baby and offer guidance as you begin breastfeeding, with special attention paid to baby's first latch.</p></div>
    </div>
  </div>
</section>
""",
    head="on-dark",
    body_class="hero-page",
)

cards = []
palette = ["bg-mauve", "bg-plum", "bg-cream", "bg-plum-deep"]
for i, t in enumerate(T):
    bg = palette[i % 4]
    ink = " style=color:#2c2424" if bg == "bg-cream" else ""
    body = "".join(f"<p>{esc(p)}</p>" for p in t.get("body", []))
    cards.append(f"""
<section class="t-card {bg}"{ink}>
  <div class="wrap narrow">
    <p class="lead">"{esc(t.get('lead') or '')}"</p>
    {body}
    <p class="name">~ {esc(t.get('name') or '')}</p>
  </div>
</section>
""")

page(
    "/testimonials/",
    "Testimonials · Cascade Doula Care",
    "Stories from families Nicole has supported.",
    f"""
<section class="band bg-mauve center">
  <div class="wrap">
    <h1>Y O U R &nbsp; S T O R I E S</h1>
    <img class="floral" src="/assets/img/floral-pink.png" alt="">
  </div>
</section>
{''.join(cards)}
""",
)

page(
    "/consultation/",
    "Consultation · Cascade Doula Care",
    "Book a consult in Santa Cruz or Los Gatos.",
    """
<section class="photo-hero">
  <img class="bg" src="/assets/img/photo-boardwalk.jpg" alt="">
  <div class="veil"></div>
  <div class="inner" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;min-height:62vh">
    <h1>consultation</h1>
    <div style="display:grid;gap:16px;justify-items:start">
      <a class="pill" href="https://calendly.com/cascadedoulanl/30min" target="_blank" rel="noopener">book now // Santa Cruz</a>
      <a class="pill" href="https://calendly.com/cascadedoulanl/60-minute-consultation-clone" target="_blank" rel="noopener">book now // los gatos</a>
    </div>
  </div>
</section>
""",
    head="on-dark",
    body_class="hero-page",
)

page(
    "/contact/",
    "Contact · Cascade Doula Care",
    "Office hours and a form to reach Nicole Lakey.",
    """
<section class="band bg-paper">
  <div class="wrap hours">
    <h1>office hours</h1>
    <p>LABOR SERVICE: <mark>available 24/7</mark></p>
    <p>DOULA HOURS: <mark>Monday - Friday (9am - 4pm)</mark></p>
  </div>
</section>
<section class="band bg-sage" style="min-height:280px">
  <div class="wrap" style="display:grid;gap:16px;max-width:360px">
    <a class="pill" href="https://calendly.com/cascadedoulanl/30min" target="_blank" rel="noopener">SANTA CRUZ CONSULTATION</a>
    <a class="pill" href="https://calendly.com/cascadedoulanl/60-minute-consultation-clone" target="_blank" rel="noopener">LOS GATOS CONSULTATION</a>
  </div>
</section>
<section class="band bg-mauve center">
  <div class="wrap">
    <h2>CONTACT NICOLE !</h2>
    <a class="pill" href="#form" data-open-form>Open Form</a>
  </div>
</section>
""",
)

page(
    "/creative-funding/",
    "Creative Funding · Cascade Doula Care",
    "Medi-Cal, Kaiser, FSA/HSA, and other ways to fund doula care.",
    """
<section class="photo-hero">
  <img class="bg" src="/assets/img/photo-couple.jpg" alt="">
  <div class="veil"></div>
  <div class="inner" style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:end;min-height:46vh">
    <h1>EVERY FAMILY<br>DESERVES A DOULA</h1>
    <p class="quote">I believe every family deserves the support of a doula, and want to make that as accessible as possible.</p>
  </div>
</section>
<section class="band bg-blush" style="color:var(--ink)">
  <div class="wrap center narrow">
    <h2>CREATIVE WAYS TO FUND DOULA CARE</h2>
    <p class="quote">Payment Options &amp; Insurance Coverage</p>
    <p>Creative Ways to Fund Doula Care! Let's find your family the support you need.</p>
    <ul class="ul-plain" style="text-align:left">
      <li><b>FSA/HSA Accounts.</b> Doula care often qualifies. We'll provide a superbill/invoice for insurance reimbursement.</li>
      <li><b>Insurance Coverage.</b> I currently accept Kaiser and Medi-Cal, and more companies are joining every month.</li>
      <li><b>Employer Benefits.</b> Some employers offer programs like Carrot that cover doula services.</li>
      <li><b>Baby Registry.</b> Add doula support to your registry with platforms like Be Her Village or Little Honey Money.</li>
      <li><b>Give Back.</b> You can create a donation fund to help local mama's in need, to access the care they deserve.</li>
    </ul>
    <h3>Covered Options</h3>
    <p><b>Medi-Cal.</b> My doula services are covered through Medi-Cal. This package includes:</p>
    <ul class="ul-plain" style="text-align:left">
      <li>Up to 8 prenatal and/or postpartum visits (in-person or virtual, mixed as needed).</li>
      <li>Birth support (in-person or virtual, if desired).</li>
      <li>Medi-Cal clients may also qualify for up to 9 additional postpartum visits with a provider's referral.</li>
    </ul>
  </div>
</section>
""",
    head="on-dark",
    body_class="hero-page",
)

page(
    "/body-ready-method/",
    "Body Ready Method · Cascade Doula Care",
    "Body Ready Method sessions with Nicole Lakey. Assessment, follow-up, intensive, and postpartum.",
    """
<section class="photo-hero">
  <img class="bg" src="/assets/img/photo-garden.jpg" alt="">
  <div class="veil"></div>
  <div class="inner">
    <h1>BODY READY METHOD</h1>
    <p>Helping you move through pregnancy, birth, and postpartum with strength and ease.</p>
  </div>
</section>
<section class="band bg-cream">
  <div class="wrap grid-2">
    <img src="/assets/img/photo-boardwalk.jpg" alt="">
    <div>
      <h2>What Is Body Ready Method® (BRM®)?</h2>
      <p>BRM® is an evidence-based approach that optimizes movement, alignment, and body balance to support a more functional pregnancy, efficient birth, and smoother recovery. Using the 5 Pillars of BRM®, Upper Body Mobility, Core, Pelvis, Pelvic Floor, and Movement Patterns, we train the body specifically for the task at hand: pregnancy, birth, and beyond.</p>
    </div>
  </div>
</section>
<section class="band bg-paper">
  <div class="wrap grid-2">
    <div>
      <h2>Who Should Work With Me?</h2>
      <p>You might be a good fit if you are pregnant and want to prepare your body for birth, have had previous difficult birth experiences, are worried about your core, diastasis recti, or pelvic floor, or you value function over fitness.</p>
    </div>
    <div>
      <h2>Why Work With a BRM® Pro?</h2>
      <p>Body Ready Method® Professionals understand how to support the pregnant body to find resilience, strength, and mobility. We are experts in pelvic mechanics and understand what to do during every stage of the birthing process.</p>
      <p><a class="pill dark" href="https://calendly.com/cascadedoulanl/body-ready-method-discovery-call" target="_blank" rel="noopener">schedule a discovery call with me</a></p>
    </div>
  </div>
</section>
<section class="band bg-cream">
  <div class="wrap narrow">
    <h2 class="center">1:1 BRM® Assessment &amp; Follow-Up Services</h2>
    <p>These 1-on-1 sessions are tailored to your unique body and goals. Each session includes a personalized movement assessment, body balancing techniques, and actionable strategies. Sessions are offered in-office or virtually.</p>
    <h3>Choose Your BRM® Path</h3>
    <p><b>Initial Body Ready Method® Assessment</b><br><span class="price">$175 | 90 minutes</span><br>Goals, health history, birth plans, and a head-to-toe alignment evaluation.</p>
    <p><b>Follow-Up Body Ready Method® Session</b><br><span class="price">$125 | 60 minutes</span></p>
    <p><b>Comprehensive BRM® Package</b><br><span class="price">$395 | 1 Initial + 2 Follow-Ups</span></p>
    <p><b>End of Pregnancy Intensive Session</b><br><span class="price">$225 | 90 minutes</span><br>For prodromal labor, upcoming induction, or creating space so baby can engage.</p>
    <p><b>Postpartum Session</b><br><span class="price">$125 | 60–90 minutes</span><br>Immediate postpartum through 6 months. Core, pelvic floor, shoulders, functional strength.</p>
  </div>
</section>
""",
    head="on-dark",
    body_class="hero-page",
)

page(
    "/resources-for-mamas/",
    "Resources · Cascade Doula Care",
    "Resources Nicole has collected for her mamas, including postpartum meals.",
    """
<section class="photo-hero" style="min-height:52vh">
  <img class="bg" src="/assets/img/photo-boardwalk.jpg" alt="">
  <div class="veil"></div>
  <div class="inner center">
    <h1>for my mamas</h1>
    <p>some resources i've collected for you</p>
  </div>
</section>
<section class="band bg-paper">
  <div class="wrap grid-2" style="align-items:center">
    <img src="/assets/img/photo-couple.jpg" alt="">
    <div class="center">
      <h2>R E S O U R C E S</h2>
      <p><a class="pill dark" href="https://milkyoat.com/?sca_ref=11078496.4bVqEYbNnwoih8Wh" target="_blank" rel="noopener">POSTPARTUM MEAL SERVICE</a></p>
    </div>
  </div>
</section>
""",
    head="on-dark",
    body_class="hero-page",
)

# old Squarespace slugs
for old, new in [("/testimonials-1/", "/testimonials/"), ("/contact-4/", "/contact/"), ("/home/", "/")]:
    dest = ROOT / old.strip("/") / "index.html"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(f"""<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={new}"><link rel="canonical" href="https://www.cascadedoula.com{new}"><title>Redirect</title><script>location.replace("{new}")</script>""")
    print("redirect", old, "->", new)
