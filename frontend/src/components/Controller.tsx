import { useState, useEffect } from "react";
import Title from "./Title";
import RecordMessage from "./RecordMessage";
import axios from "axios";
import BotIcon from "./BotIcon";
import Questions from "./Questions";

function Controller() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>("");

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    // Append recorded message to messages
    const myMessage = { sender: "me", text: "You sent a message.", blobUrl };
    const messagesArr = [...messages, myMessage];

    // Convert blob URL to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Construct form data to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // Send form data to API endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: { "Content-Type": "audio/mpeg" },
            responseType: "arraybuffer",
          })
          .then((res: any) => {
            const blob = res.data;
            const audioSrc = createBlobUrl(blob);

            // Append to audio
            const rachelMessage = { sender: "rachel", blobUrl: audioSrc };
            messagesArr.push(rachelMessage);
            setMessages(messagesArr);

            // Update current audio source
            setCurrentAudioSrc(audioSrc);

            // play Audio
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setIsLoading(false);
          });

        // Send form data to another API endpoint for text response
        await axios
          .post("http://localhost:8000/post-audio-text/", formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "text",
          })
          .then((res: any) => {
            const textResponse = res.data;

            // Append received text message
            const rachelTextMessage = { sender: "rachel", text: textResponse };
            messagesArr.push(rachelTextMessage);
            setMessages(messagesArr);

            setIsLoading(false);
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };

  const handleBotIconClick = () => {
    const audioElement = document.getElementById("botAudio") as HTMLAudioElement;
    if (audioElement) {
      audioElement.play();
    }
  };

  useEffect(() => {
    if (currentAudioSrc) {
      const audioElement = document.getElementById("botAudio") as HTMLAudioElement;
      if (audioElement) {
        audioElement.play();
      }
    }
  }, [currentAudioSrc]);

  return (
    <>
      <Title setMessages={setMessages} />
      <div className="grid grid-flow-col columns-3 p-4 h-screen ">
        <div className="max-w-[500px]">
          <Questions />
        </div>
        <div className="h-screen overflow-y-hidden border border-x-2 border-y-0 border-black col-span-2 ml-[100px] min-w-[550px]">
          <div className="flex flex-col justify-center h-full pb-96 ">
            {/* Bot Icon */}
            <div className="flex justify-center mt-auto items-center">
              <BotIcon onClick={handleBotIconClick} audioSrc={currentAudioSrc} />
            </div>
            {/* Conversation */}
            <div className="flex justify-center mt-auto items-center">
              {messages.length === 0 && !isLoading && (
                <div className="text-center font-light italic mt-10"> 
                  Send Rachel a Message...
                </div>
              )}
              {isLoading && (
                <div className="text-center font-light italic mt-10 animate-pulse">
                  Give me a few seconds...
                </div>
              )}
            </div>
            
          </div>
        </div>
        <div className="h-screen overflow-y-hidden max-w-[500px]">
          <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
            {/* Conversation */}
            <div className="mt-5 px-5">
              <p className="text-2xl font-bold mb-4 text-center">Conversation</p>
              {messages?.map((message, index) => (
                <div
                  key={index + message.sender}
                  className={
                    "flex flex-col " +
                    (message.sender === "rachel" ? "flex items-end" : "")
                  }
                >
                  {/* Sender */}
                  <div className="mt-4">
                    <p
                      className={
                        message.sender === "rachel"
                          ? "text-right mr-2 italic text-green-500"
                          : "ml-2 italic text-blue-500"
                      }
                    >
                      {message.sender}
                    </p>

                    {/* Message */}
                    {message.text && (
                      <p
                        className={
                          message.sender === "rachel"
                            ? "text-right mr-2 text-gray-800"
                            : "ml-2 text-gray-800"
                        }
                      >
                        {message.text}
                      </p>
                    )}

                    {/* Audio Message */}
                    {/* {message.blobUrl && (
                      // <audio
                      //   src={message.blobUrl}
                      //   className="appearance-none"
                      //   controls
                      // />
                    )} */}
                  </div>
                </div>
              ))}

              {messages.length === 0 && !isLoading && (
                <div className="text-center font-light mt-10">
                  Start Conversation...
                </div>
              )}

              {isLoading && (
                <div className="text-center font-light italic mt-10 animate-pulse">
                  loading
                </div>
              )}
            </div>
          </div>
        </div>
      <div className="fixed bottom-0 w-full border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
              <div className="flex justify-center items-center w-full">
                <RecordMessage handleStop={handleStop} />
              </div>
            </div>
      </div>
    </>
  );
}

export default Controller;
