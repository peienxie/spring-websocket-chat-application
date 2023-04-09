package com.peienxie.chatty.repository;

import java.util.List;

import com.peienxie.chatty.model.ChatMessage;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findBySenderAndReceiver(String sender, String receiver, Sort sort);
}
