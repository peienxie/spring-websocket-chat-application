package com.peienxie.chatty.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessageResponse {

    private String content;
    private String sender;
    private LocalDateTime sendAt;

}
