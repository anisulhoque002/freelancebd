import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { t } = useTranslation();

  const faqData = [
    {
      question: t("faq.questions.unique.question"),
      answer: t("faq.questions.unique.answer")
    },
    {
      question: t("faq.questions.payments.question"),
      answer: t("faq.questions.payments.answer")
    },
    {
      question: t("faq.questions.jobs.question"),
      answer: t("faq.questions.jobs.answer")
    },
    {
      question: t("faq.questions.security.question"),
      answer: t("faq.questions.security.answer")
    },
    {
      question: t("faq.questions.documents.question"),
      answer: t("faq.questions.documents.answer")
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-32 my-16">
      <h2 className="text-4xl font-bold mb-8 text-center">{t("faq.title")}</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border-2 border-[#1DBF73] rounded-md overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <span className={`transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {activeIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
