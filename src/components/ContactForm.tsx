"use client";
import ArrowIcon from "@/components/ArrowIcon";
import { useState } from "react";
export default function ContactForm({
  services,
  selected = "",
  sent = false,
}: {
  services: string[];
  selected?: string;
  sent?: boolean;
}) {
  const [status, setStatus] = useState(sent ? "success" : "");
  const [message, setMessage] = useState(
    sent
      ? "Your inquiry has been saved for review. This is not yet a confirmed appointment."
      : "",
  );
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="contact-form"
      action="/api/inquiry"
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setStatus("");
        const form = e.currentTarget;
        try {
          const r = await fetch("/api/inquiry", {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          const result = await r.json();
          if (!r.ok)
            throw new Error(
              result.error ||
                "We could not save your inquiry. Please try again.",
            );
          setStatus("success");
          setMessage(
            "Your inquiry has been saved for review. This is not yet a confirmed appointment.",
          );
          form.reset();
        } catch (err) {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="form-row">
        <label>
          Your name *
          <input
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Alex Morgan"
          />
        </label>
        <label>
          Work email *
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="alex@company.com"
          />
        </label>
      </div>
      <label>
        Company
        <input
          name="company"
          autoComplete="organization"
          maxLength={150}
          placeholder="Your company or project"
        />
      </label>
      <label>
        What are you thinking about?
        <select
          name="service"
          defaultValue={services.includes(selected) ? selected : ""}
        >
          <option value="">Let’s figure it out together</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        A little about your next move *
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={4}
          placeholder="Tell us what you are working toward, what needs to change, or where you would like to start."
        />
      </label>
      <div className="honeypot" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree that Paertner may use these details to respond to my inquiry.
          Read the <a href="/privacy">privacy notice</a>.
        </span>
      </label>
      <button type="submit" className="form-submit" disabled={busy}>
        <span>{busy ? "Saving your inquiry…" : "Request a conversation"}</span>
        <span aria-hidden><ArrowIcon /></span>
      </button>
      <p className="form-note">
        Your request goes to our private inquiry inbox. We will agree on a time
        together.
      </p>
      {message && (
        <div
          className={"form-status " + status}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </div>
      )}
    </form>
  );
}
