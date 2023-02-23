import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../../contexts/settingsContext";
import { useApi } from "../../contexts/apiContext";

import { ChatContentItem, Answer, Question } from "./styles";

import { ChatCardProps } from "./ChatCard";

interface LastChatCardProps extends ChatCardProps {
  chatContainerRef: RefObject<HTMLUListElement>,
  stored: boolean
}

export const LastChatCard: React.FC<LastChatCardProps> = ({
  question,
  answer,
  chatContainerRef,
  stored
}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { settings } = useSettings();
  const { setApiMessage } = useApi()

  const settingsRef = useRef(settings);
  const isMountedRef = useRef(true);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    setCurrentAnswer("");

    if (!stored) {
      writeResponse();
    } else {
      setCurrentAnswer(answer)
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [answer]);

  const writeResponse = useCallback(async () => {
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let index = 0; index < answer.length; index++) {
      if (!isMountedRef.current) break;

      const letter = answer[index];
      setCurrentAnswer((prevState) => prevState + letter);
      setApiMessage({
        message: `Respondendo [ ${index + 1} / ${answer.length}  ] ${Math.floor((index + 1) / answer.length * 100)}%`,
        isError: false
      })

      chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;

      console.log(settingsRef.current.speed);
      await sleep(settingsRef.current.speed);
    }

    setApiMessage({
      message: `Concluído [ ${answer.length} / ${answer.length}  ] 100%`,
      isError: false
    })
  }, [answer, chatContainerRef]);

  return (
    <ChatContentItem>
      <Question>
        <i className="bi bi-send-fill" />
        <h3>{question}</h3>
      </Question>
      <Answer>{currentAnswer}</Answer>
    </ChatContentItem>
  );
};
