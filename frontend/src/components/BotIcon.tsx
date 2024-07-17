import React from 'react';

interface BotIconProps {
  onClick: () => void;
  audioSrc: string;
}

const BotIcon: React.FC<BotIconProps> = ({ onClick, audioSrc }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="w-44 h-44 rounded-full bg-blue-500 flex items-center justify-center relative">
        <img src="/bot-icon.jpeg" alt="Bot" className="w-40 h-40 rounded-full" />
        <audio src={audioSrc} id="botAudio" className="hidden" />
      </div>
    </div>
  );
};

export default BotIcon;
