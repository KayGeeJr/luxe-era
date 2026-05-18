import NewsletterForm from "../NewsletterForm";

export default function HomeNewsletter() {
  return (
    <section className="border-t border-neutral-200 bg-[#f7f7f7] py-16 sm:py-24">
      <div className="mx-auto max-w-lg px-6 text-center sm:px-10">
        <p className="ref-kicker">Newsletter</p>
        <h2 className="mt-5 font-display text-3xl font-light text-neutral-900 sm:text-4xl">
          New drops, first access
        </h2>
        <p className="mt-4 text-sm font-light text-neutral-600">
          Limited collections — join the list to hear before anyone else.
        </p>
        <div className="mt-8">
          <NewsletterForm variant="light" />
        </div>
      </div>
    </section>
  );
}
