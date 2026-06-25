import { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { getContactPageSchema, getOrganizationSchema } from "@/lib/seo-json-ld";

export const metadata: Metadata = {
  title: "Contact Us | Brand Estate",
  description: "Have questions regarding property directory listings or our SaaS broker console subscriptions? Drop us a line.",
  openGraph: {
    title: "Contact Us | Brand Estate",
    description: "Have questions regarding property directory listings or our SaaS broker console subscriptions? Drop us a line.",
    url: "/contact",
    siteName: "Brand Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Us | Brand Estate",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Brand Estate",
    description: "Have questions regarding property directory listings or our SaaS broker console subscriptions? Drop us a line.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  const contactSchema = getContactPageSchema();
  const orgSchema = getOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <ContactClient />
    </>
  );
}
