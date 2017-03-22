/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

/**
 *
 * @author estudiante
 */
import edu.eci.arsw.msgbroker.model.Point;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author estudiante
 */
@RestController
@RequestMapping(value = "/dibujos")
@Service
public class ApiController {

    private HashMap<Integer, ArrayList<String>> lista = new HashMap<>();

    @RequestMapping(path = "/{iddibujo}/colaboradores", method = RequestMethod.GET)
    public ResponseEntity<?> manejadorGetRecursoOrdersAPITotal(@PathVariable int iddibujo) {
        try {
            //obtener datos que se enviarán a través del API
            ArrayList<String> data = lista.get(iddibujo);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(ApiController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(path = "/{iddibujo}", method = RequestMethod.PUT)
    public ResponseEntity<?> manejadorPutRecursoOrdenes(@PathVariable int iddibujo, @RequestBody String nombre) {
        try{
            System.out.println("hooooooola"+nombre+iddibujo);
            if (lista.containsKey(iddibujo)) {
                ArrayList<String> temp = lista.get(iddibujo);
                temp.add(nombre);
                lista.put(iddibujo, temp);
            } else {
                ArrayList<String> temp = new ArrayList<>();
                temp.add(nombre);
                lista.put(iddibujo, temp);
            }

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(ApiController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }

    }

}
