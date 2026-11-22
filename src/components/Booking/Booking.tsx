import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "@/lib/firebase";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./Booking.css";

interface SessionPackage {
  id: string;
  title: string;
  duration: string;
  defaultEdits: number;
  editsLabel: string;
  price: number;
}

const PACKAGES: SessionPackage[] = [
  {
    id: "individual",
    title: "Individual portraits",
    duration: "45 min",
    defaultEdits: 15,
    editsLabel: "15 edited photos",
    price: 200,
  },
  {
    id: "couples",
    title: "Couples",
    duration: "60 min",
    defaultEdits: 10,
    editsLabel: "10 edited photos",
    price: 300,
  },
  {
    id: "families",
    title: "Families",
    duration: "60 min",
    defaultEdits: 0,
    editsLabel: "To be decided · 1–3 people ₪300 · 4–6 people price to confirm",
    price: 300,
  },
  {
    id: "graduation",
    title: "Graduation",
    duration: "30 min",
    defaultEdits: 0,
    editsLabel: "Edited photos to be decided",
    price: 150,
  },
];

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

type Step = "session" | "details" | "review" | "confirmed";

function getLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("session");
  const [selectedPkg, setSelectedPkg] = useState<SessionPackage>(PACKAGES[0]);

  const today = getLocalDate(new Date());
  const [date, setDate] = useState(() => {
    const suggested = new Date();
    suggested.setDate(suggested.getDate() + 4);
    return getLocalDate(suggested);
  });
  const [time, setTime] = useState("4:00 PM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestedEdits, setRequestedEdits] = useState(15);
  const [customNotes, setCustomNotes] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Decide later");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const extraEdits = Math.max(0, requestedEdits - selectedPkg.defaultEdits);
  const totalPrice = useMemo(
    () => selectedPkg.price + extraEdits * 10,
    [selectedPkg, extraEdits]
  );

  const selectPackage = (pkg: SessionPackage) => {
    setSelectedPkg(pkg);
    setRequestedEdits(pkg.defaultEdits);
    setStep("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reviewSession = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmBooking = async () => {
    setSubmitting(true);
    setError("");
    const id = `YO-${Date.now().toString().slice(-8)}`;
    setBookingId(id);

    const manageUrl = `${window.location.origin}/manage?id=${id}&email=${encodeURIComponent(email)}`;

    const request = {
      id,
      package: selectedPkg.title,
      date,
      time,
      timezone: "Palestine time",
      duration: selectedPkg.duration,
      includedEdits: selectedPkg.defaultEdits,
      requestedEdits,
      priceIls: totalPrice,
      name,
      email: email.trim().toLowerCase(),
      phone,
      paymentMethod,
      customNotes,
      createdAt: new Date().toISOString(),
      status: "Awaiting photographer confirmation",
    };

    try {
      // 1. Save booking request securely to Firebase Firestore
      await setDoc(doc(db, "bookings", id), request);
      console.log("Saved to Firestore successfully!");

      // 2. Send instant EmailJS notification to Yara using the new service ID
      await emailjs.send(
        "service_qchijsr",
        "template_new_booking",
        {
          booking_id: id,
          client_name: name,
          client_email: email,
          client_phone: phone || "Not provided",
          session_type: selectedPkg.title,
          session_date: date,
          session_time: time,
          edited_photos: String(requestedEdits),
          total_price: `₪${totalPrice}`,
          payment_method: paymentMethod,
          custom_notes: customNotes || "None",
          manage_link: manageUrl,
          to_email: "yaraodehph@gmail.com",
        },
        "UDhu9CPX98aFgE27g"
      );
      console.log("Email sent successfully via EmailJS!");

      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setError(`Error: ${err.text || err.message || "Something went wrong. Check browser console."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="booking-page">
        <div className="booking-shell">
          <div className="booking-heading">
            <p className="booking-eyebrow">Yara Odeh Photography</p>
            <h1>Session <span>Booking</span></h1>
          </div>

          {step !== "confirmed" && (
            <div className="booking-progress" aria-label="Booking progress">
              {(["session", "details", "review"] as const).map((item, index) => (
                <button
                  type="button"
                  key={item}
                  className={step === item ? "active" : ""}
                  onClick={() => {
                    if (item === "review" && !email) return;
                    setStep(item);
                  }}
                  disabled={item === "review" && !email}
                >
                  <span>{index + 1}</span>
                  {item === "session" ? "Session" : item === "details" ? "Details" : "Review"}
                </button>
              ))}
            </div>
          )}

          {step === "session" && (
            <section className="booking-panel fade-in">
              <div className="panel-heading">
                <p className="panel-kicker">Choose an experience</p>
                <h2>Which session speaks to you?</h2>
              </div>
              <div className="booking-package-grid">
                {PACKAGES.map((pkg) => (
                  <button
                    type="button"
                    className="booking-package"
                    key={pkg.id}
                    onClick={() => selectPackage(pkg)}
                  >
                    <span>
                      <strong>{pkg.title}</strong>
                      <small>{pkg.duration} · {pkg.editsLabel}</small>
                    </span>
                    <span className="package-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === "details" && (
            <section className="booking-panel fade-in">
              <button type="button" className="booking-back" onClick={() => setStep("session")}>
                ← Back to sessions
              </button>
              <div className="panel-heading">
                <p className="panel-kicker">{selectedPkg.title}</p>
                <h2>Plan your session</h2>
                <p>{selectedPkg.duration} · {selectedPkg.editsLabel} · Starts at ₪{selectedPkg.price}</p>
              </div>

              <form className="booking-form" onSubmit={reviewSession}>
                <div className="booking-form-grid">
                  <div className="booking-field">
                    <label htmlFor="booking-name">Your name</label>
                    <input id="booking-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-email">Email address</label>
                    <input id="booking-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-phone">Phone <span>(optional)</span></label>
                    <input id="booking-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+970..." />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-edits">Requested edited photos</label>
                    <input id="booking-edits" type="number" min={1} max={100} value={requestedEdits} onChange={(e) => setRequestedEdits(Number(e.target.value))} />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-date">Preferred date</label>
                    <input id="booking-date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-time">Available time</label>
                    <select id="booking-time" value={time} onChange={(e) => setTime(e.target.value)}>
                      {TIME_SLOTS.map((slot) => <option key={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>

                <p className="booking-hint">Hourly start times, 9 AM–7 PM · Palestine time</p>

                <div className="booking-customize">
                  <button type="button" aria-expanded={showCustomize} onClick={() => setShowCustomize((open) => !open)}>
                    <span>{showCustomize ? "−" : "+"}</span> Customize your session
                  </button>
                  {showCustomize && (
                    <textarea rows={4} value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} placeholder="Tell Yara about location ideas, outfit changes, or special requests..." />
                  )}
                </div>

                {error && <p className="booking-error" role="alert">{error}</p>}
                <button type="submit" className="booking-primary">Review my session <span>→</span></button>
              </form>
            </section>
          )}

          {step === "review" && (
            <section className="booking-panel fade-in">
              <button type="button" className="booking-back" onClick={() => setStep("details")}>← Back to details</button>
              <div className="panel-heading">
                <p className="panel-kicker">One last look</p>
                <h2>Review your request</h2>
              </div>

              <div className="booking-review-grid">
                <div className="booking-summary">
                  {[
                    ["Session", selectedPkg.title],
                    ["Duration", selectedPkg.duration],
                    ["Date", date],
                    ["Time", `${time} · Palestine time`],
                    ["Client", name],
                    ["Email", email],
                    ["Edited photos", String(requestedEdits)],
                  ].map(([label, value]) => (
                    <div className="summary-row" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                  <div className="summary-row summary-price">
                    <span>Estimated session price</span>
                    <strong>₪{totalPrice}</strong>
                  </div>
                </div>

                <aside className="booking-payment">
                  <label htmlFor="payment-method">Preferred payment method</label>
                  <select id="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Decide later</option>
                    <option>Cash</option>
                    <option>Visa</option>
                  </select>
                  <p>This is a booking request, not an immediate confirmation. Yara will confirm availability and final pricing with you directly.</p>
                  {error && <p className="booking-error" role="alert">{error}</p>}
                  <button type="button" className="booking-primary" onClick={confirmBooking} disabled={submitting}>
                    {submitting ? "Sending request..." : "Send booking request"} <span>→</span>
                  </button>
                </aside>
              </div>
            </section>
          )}

          {step === "confirmed" && (
            <section className="booking-panel booking-confirmed fade-in">
              <div className="confirmed-icon">✓</div>
              <p className="panel-kicker">Request sent successfully</p>
              <h2>You're all set!</h2>
              <p>
                Reference <strong>{bookingId}</strong>. Your session request has been saved and sent to Yara.
                She will review your date and time and follow up with confirmation shortly.
              </p>
              <div className="confirmed-actions">
                <button type="button" className="booking-primary" onClick={() => navigate("/")}>Return to portfolio</button>
                <button type="button" className="booking-secondary" onClick={() => setStep("session")}>Book another session</button>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}