import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "How does the secret sharing work?",
    answer: "Secrets and files are encrypted before being sent to the server. The server only has the encrypted data, and the decryption key is never stored. The secret is deleted after being viewed."
  },
  {
    question: "I want to ensure that my secret is not sent unencrypted, how can I ensure that?",
    answer: "This project is open source, so you can host your own instance of the service. The source code is available on github to review."
  },
  {
    question: "When will my secret be deleted?",
    answer: "The secret will be deleted after it is viewed. The exact time is not known to the server, so it is not possible to determine when the secret will be deleted. However, it is guaranteed to expire after the specified time."
  },
  {
    question: "Can I host my own instance of this service?",
    answer: "Yes, you can host your own instance of this service. Please refer to the github repository for more information."
  },
  {
    question: "I have a feature request, who can I contact?",
    answer: "Please contact us at contact@stackedlayer.com with your feature request."
  },
  {
    question: "I have a bug report, who can I contact?",
    answer: "Please contact us at contact@stackedlayer.com with your bug report."
  },
  {
    question: "I have a question about the service, who can I contact?",
    answer: "Please contact us at contact@stackedlayer.com with your question."
  }
];

export const FAQIsland = () => {

  const contactSupport = () => {
    window.open("mailto:contact@stackedlayer.com", "_blank");
  }

  return (
    <div id="faqs">
      {/* Hero Section */}
      <div className="w-full py-12 text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Find answers to common questions about our services and platform.
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 pb-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions? Our support team is here to help.
          </p>
          <Button variant="outline" className="mt-4 p-2" onClick={contactSupport}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};