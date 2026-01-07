import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { faqData } from "@/data/faqData";

export function FaqPage() {
  const faqs = faqData;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Header Section */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center lg:text-left">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed text-center lg:text-left">
                Temukan jawaban untuk pertanyaan yang sering ditanyakan
              </p>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="lg:col-span-8">
            {faqs && faqs.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className={`border-b ${index === faqs.length - 1
                        ? "border-b-0"
                        : "border-gray-200"
                        } py-2`}
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4 hover:text-primary transition-colors group">
                        <span className="font-semibold text-gray-900 text-base lg:text-lg pr-4 group-hover:text-primary transition-colors">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Bottom Help Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-primary/5 to-orange-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      Masih ada pertanyaan?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tim kami siap membantu Anda. Hubungi kami melalui email
                      atau telepon.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="mailto:contact@satutangan.my.id"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                      >
                        contact@satutangan.my.id
                      </a>
                      <span className="text-gray-400">•</span>
                      <a
                        href="tel:+62-812-3456-7890"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                      >
                        +62 812-3456-7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Belum ada FAQ yang tersedia
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqPage;
