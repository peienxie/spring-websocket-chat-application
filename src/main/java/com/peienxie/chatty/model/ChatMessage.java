package com.peienxie.chatty.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessage {
    private String content;
    private String username;
    private LocalDateTime timestamp;
}
