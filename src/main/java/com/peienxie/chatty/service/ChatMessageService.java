package com.peienxie.chatty.service;

import java.util.List;

import com.peienxie.chatty.model.ChatMessage;
import com.peienxie.chatty.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public void saveMessage(ChatMessage chatMessage) {
        chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getMessages() {
        return chatMessageRepository.findAll(Sort.by("sendAt").descending());
    }

    public List<ChatMessage> getMessagesBySenderAndReceiver(String sender, String receiver) {
        return chatMessageRepository.findBySenderAndReceiver(sender, receiver, Sort.by("sendAt").descending());
    }
}
