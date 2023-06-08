package com.gestion.app.rest.Controller;

import com.gestion.app.rest.Model.Cliente;
import com.gestion.app.rest.Repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;

    @GetMapping(value = "/")
    public String holaMundo(){
        return "hola Mundo";
    }

    @GetMapping(value = "/clientes")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
    public List <Cliente> getCliente(){
        return todoRepository.findAll();
    }

    @PostMapping(value = "/savecliente")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
    public String saveCliente(@RequestBody Cliente cliente){
        todoRepository.save(cliente);
        return "Cliente dado de alta";
    }

    @PutMapping(value = "/editarcliente/{id}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.PUT })
    public String editarCliente(@PathVariable int id, @RequestBody Cliente cliente){
        Cliente editarCliente = todoRepository.findById(id).get();
        editarCliente.setDni(cliente.getDni());
        editarCliente.setApellido(cliente.getApellido());
        editarCliente.setNombre(cliente.getNombre());
        editarCliente.setDomicilio(cliente.getDomicilio());
        editarCliente.setTelefono(cliente.getTelefono());
        editarCliente.setZona(cliente.getZona());
        editarCliente.setEmail(cliente.getEmail());
        editarCliente.setDescripcion(cliente.getDescripcion());
        todoRepository.save(editarCliente);
        return "cliente editado";
    }

    @PutMapping(value = "/bajaCliente/{id}")
    @CrossOrigin(origins = "*", methods = {RequestMethod.PUT})
    public String bajaCliente(@PathVariable int id, @RequestBody Cliente cliente){
        Cliente bajaCliente = todoRepository.findById(id).get();
        bajaCliente.setEstado(cliente.getEstado());
        todoRepository.save(bajaCliente);
        return "cliente dado de baja";
    }
}