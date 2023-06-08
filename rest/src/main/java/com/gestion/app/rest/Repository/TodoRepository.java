package com.gestion.app.rest.Repository;


import com.gestion.app.rest.Model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Cliente, Integer> {
}
