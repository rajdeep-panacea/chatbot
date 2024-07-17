import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
    { id: 1, text: "Do you regularly update the firmware on your networking devices?" },
    { id: 2, text: "Have you configured a firewall on your network to prevent unauthorized access?" },
    { id: 3, text: "Do you use WPA3 encryption for your Wi-Fi network?" },
    { id: 4, text: "Are all your networking devices (routers, switches, etc.) protected with strong passwords?" },
    { id: 5, text: "Have you set up VLANs (Virtual Local Area Networks) to segment network traffic?" },
    { id: 6, text: "Do you use a VPN (Virtual Private Network) when accessing your network remotely?" },
    { id: 7, text: "Have you disabled unused ports on your network switches to prevent unauthorized access?" },
    { id: 8, text: "Have you configured QoS (Quality of Service) on your network to prioritize critical traffic?" }
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
      <h2 className="text-2xl font-bold mb-4">Checklist</h2>
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
