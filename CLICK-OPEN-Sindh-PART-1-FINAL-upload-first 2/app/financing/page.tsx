import type { Metadata } from "next";
import { CircleDollarSign, FileCheck2, ShieldCheck } from "lucide-react";
import { FinanceForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Financing",
  description: "Apply for vehicle financing with Sindh Automotive Dealers."
};

const faqs = [
  { question: "Can I apply before choosing a vehicle?", answer: "Yes. We can pre-qualify you and help match your approval to available inventory." },
  { question: "What information do I need?", answer: "A finance specialist may ask for basic contact details, employment information, income details, and the vehicle you are interested in." },
  { question: "Will applying affect my credit?", answer: "Our team will explain the process clearly before any formal credit submission is made." }
];

export default function FinancingPage() {
  return (
    <section className="bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">Financing</p>
            <h1 className="mt-3 text-4xl font-black text-ink sm:text-5xl dark:text-white">Flexible Vehicle Financing</h1>
            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-300">
              Our finance team works with trusted lenders to help you compare practical options, understand payment ranges, and move forward with clarity.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                { icon: CircleDollarSign, title: "Competitive Terms", text: "Options built around your budget, down payment, and vehicle choice." },
                { icon: FileCheck2, title: "Simple Application", text: "Start online and complete details with a dealership specialist." },
                { icon: ShieldCheck, title: "Clear Guidance", text: "Straightforward dealership support with no pressure." }
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-black/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-zinc-950">
                  <item.icon className="mb-3 text-racing" />
                  <h2 className="font-black text-ink dark:text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <FinanceForm />
        </div>

        <div className="mt-12 rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-2xl font-black text-ink dark:text-white">Financing FAQ</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-black text-ink dark:text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
