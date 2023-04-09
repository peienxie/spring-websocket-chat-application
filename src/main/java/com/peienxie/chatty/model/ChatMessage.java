package com.peienxie.chatty.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessage {
    private String id;
    private String content;
    private String sender;
    private String receiver;
    private LocalDateTime sendAt;
    private boolean read;
}
