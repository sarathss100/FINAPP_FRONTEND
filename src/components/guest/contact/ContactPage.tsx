"use client";
import { MailIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/base/Card';
import { toast } from 'react-toastify';
import { getFAQs } from '@/service/publicService';
import { IFaq, IFaqs } from '@/types/IFaq';

const ContactPageBody = function () {
  const [faqItems, setFaqItems] = useState<IFaq[]>([]);
  // Contact information data
  const contactMethods = [
    {
      icon: <MailIcon className="h-5 w-5 text-white" />,
      iconBgColor: "bg-[#004a7c]",
      title: "Email Support",
      details: ["sarathssofficial100@gmail.com"],
      actionText: "Click to copy email address",
      actionColor: "text-[#00a9e0]",
    },
    {
      icon: <PhoneIcon className="h-[18px] w-[18px] text-white" />,
      iconBgColor: "bg-[#00a9e0]",
      title: "Phone Support",
      details: ["+91-7356866630"],
      actionText: "Click to copy phone number",
      actionColor: "text-[#00a9e0]",
      additionalInfo: "Available Monday - Friday, 9AM - 6PM EST",
    },
  ];

  useEffect(() => {
    const fetchDetails = async function () {
      const data: IFaqs = await getFAQs();
      setFaqItems(data.data.faqDetails);
    }
    fetchDetails();
  }, []);

  // Function to copy text to clipboard
  const copyToClipboard = function (text: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Successfully Copied: ${text}`);
    });
  };

  return (
    <div className="relative w-[1271px] h-[553px]">
      {/* Contact Information Section */}
      <Card className="absolute w-[696px] h-[553px] left-[76px] shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-0">
          <CardTitle className="font-normal text-2xl leading-9">
            Contact Us
          </CardTitle>
          <p className="font-normal text-gray-500 text-base leading-6 mt-1">
            We&apos;re here to help! Reach out to us through any of these
            channels.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="border rounded-lg">
              <CardContent className="p-4 flex items-start">
                <div
                  className={`w-10 h-10 ${method.iconBgColor} rounded-lg flex items-center justify-center mr-4`}
                >
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-normal text-black text-base leading-6">
                    {method.title}
                  </h3>
                  {method.details.map((detail, i) => (
                    <p
                      key={i}
                      className="font-normal text-gray-500 text-sm leading-[21px] mt-1"
                    >
                      {detail}
                    </p>
                  ))}
                  {method.actionText && (
                    <p
                      onClick={() => copyToClipboard(method.details[0])}
                      className={`${method.actionColor} text-xs leading-[18px] mt-1 cursor-pointer`}
                    >
                      {method.actionText}
                    </p>
                  )}
                  {method.additionalInfo && (
                    <p className="font-normal text-gray-500 text-xs leading-[18px] mt-1">
                      {method.additionalInfo}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      {/* FAQ Card */}
      <Card className="absolute w-[400px] h-[450px] top-8 left-[796px] shadow-[0px_1px_2px_#0000000d]">
        <CardHeader className="pb-2">
          <CardTitle className="font-normal text-xl leading-[30px]">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqItems.map((faq, index) => (
            <Card key={index} className="border rounded-lg">
              <CardContent className="p-4">
                <h3 className="font-normal text-black text-base leading-6">
                  {faq.question}
                </h3>
                <p className="font-normal text-gray-500 text-sm leading-[21px] mt-2">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPageBody;
