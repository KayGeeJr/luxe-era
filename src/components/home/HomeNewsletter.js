import NewsletterForm from "../NewsletterForm";

export default function HomeNewsletter() {
  return (
    <section className="border-t border-neutral-800 bg-neutral-950 py-20 sm:py-24">
      <div className="mx-auto max-w-lg px-6 text-center sm:px-10">
        <p className="luxe-eyebrow text-accent/90">Newsletter</p>
        <h2 className="mt-4 font-display text-3xl font-light text-white sm:text-4xl">
          New drops, first access.
        </h2>
        <p className="mt-3 text-sm text-white/50">
          Limited collections — join the list to hear before anyone else.
        </p>
        <div className="mt-8">
          <NewsletterForm variant="dark" />
        </div>
      </div>
    </section>
  );
}
