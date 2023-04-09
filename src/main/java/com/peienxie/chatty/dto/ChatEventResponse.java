package com.peienxie.chatty.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ChatEventResponse {

    private ChatEvent event;
    private String username;

}
