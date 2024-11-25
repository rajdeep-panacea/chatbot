import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
    { id: 1, text: "Firmware on networking devices is not updated regularly." },
    { id: 2, text: "Firewall is not configured to prevent unauthorized access." },
    { id: 3, text: "Wi-Fi network does not use WPA3 encryption." },
    { id: 4, text: "Networking devices are not protected with strong passwords." },
    { id: 5, text: "VLANs (Virtual Local Area Networks) are not set up to segment network traffic." },
    { id: 6, text: "VPN (Virtual Private Network) is not used for remote access to the network." },
    { id: 7, text: "Unused ports on network switches are not disabled to prevent unauthorized access." },
    { id: 8, text: "QoS (Quality of Service) is not configured to prioritize critical traffic." }

  ];

const Questions: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});

  const handleCheckboxChange = (id: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: !prevAnswers[id],
    }));
  };

  return (
    <div className="mx-auto pt-6 pl-6 -mr-[400px] bg-white">
      <h2 className="text-2xl font-bold mb-4">Remediation</h2>
      <ul className="space-y-4 w-1/2">
        {questions.map((question) => (
          <li key={question.id} className="flex items-center">
            <input
              type="checkbox"
              id={`question-${question.id}`}
              checked={!!answers[question.id]}
              onChange={() => handleCheckboxChange(question.id)}
              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`question-${question.id}`} className="text-gray-700">
              {question.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;
