import React from "react"
import { useChats } from "../../contexts/chatsContext"

import { ChatsContainer, Placeholder } from "./styles"

import { Chat } from "./Chat"

export const Chats: React.FC = () => {
  const { chats, setCurrentChatId } = useChats()

  return (
    <ChatsContainer>
      {!!chats.length ? (
        chats.map(chat => (
          <Chat
            key={chat.id}
            id={chat.id}
            title={chat.title}
            setCurrentChatId={() => setCurrentChatId(chat.id)}
          />
        ))
      ) : (
        <Placeholder>Nenhum chat</Placeholder>
      )}
    </ChatsContainer>
  )
}