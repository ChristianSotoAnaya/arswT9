/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

import com.sun.media.jfxmedia.logging.Logger;
import edu.eci.arsw.msgbroker.model.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller

public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;

    private ConcurrentLinkedQueue<Point> lista = new ConcurrentLinkedQueue();

    @MessageMapping("/newpoint")
    public void getLine(Point pt) throws Exception {
        synchronized (this) {
            System.out.println("Nuevo punto recibido en el servidor!:" + pt);
            msgt.convertAndSend("/topic/newpoint", pt);
            lista.add(pt);

            if (lista.size() == 4) {
                msgt.convertAndSend("/topic/newpolygon", lista);
                lista.clear();
            }
        }

    }

    @MessageMapping("/newdibujo.{iddibujo}")
    public void handleBaz(@DestinationVariable int iddibujo, Point pt) {
        synchronized (this) {
            System.out.println("Punto de la sala:" + iddibujo+ pt);
            msgt.convertAndSend("/topic/newdibujo."+iddibujo, pt);
            lista.add(pt);

            if (lista.size() == 4) {
                msgt.convertAndSend("/topic/newpolygon."+iddibujo, lista);
                lista.clear();
            }
        }

    }
    

}
