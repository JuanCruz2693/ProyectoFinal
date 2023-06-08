package com.gestion.app.rest.Model;

import jakarta.persistence.*;

@Entity
@Table(schema = "cliente")
public class Cliente {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  @Column
  private String apellido;
  @Column
  private String nombre;
  @Column(unique = true)
  private int dni;
  @Column
  private String domicilio;
  @Column
  private String telefono;
  @Column
  private int zona;
  @Column(nullable = false)
  private char estado;
  @Column
  private String email;
  @Column
  private String descripcion;

  public int getId() {

    return id;
  }

  public void setId(int id) {

    this.id = id;
  }

  public String getApellido() {

    return apellido;
  }

  public void setApellido(String apellido) {
    this.apellido = apellido;
  }
  public String getNombre(){
    return nombre;
  }
  public void setNombre(String nombre){
    this.nombre = nombre;
  }

  public int getDni() {

    return dni;
  }

  public void setDni(int dni) {
    this.dni = dni;
  }

  public String getDomicilio() {
    return domicilio;
  }

  public void setDomicilio(String domicilio) {
    this.domicilio = domicilio;
  }

  public String getTelefono() {
    return telefono;
  }

  public void setTelefono(String telefono) {
    this.telefono = telefono;
  }

  public int getZona() {
    return zona;
  }

  public void setZona(int zona) {
    this.zona = zona;
  }

  public char getEstado() {
    return estado;
  }

  public void setEstado(char estado) {
    this.estado = estado;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDescripcion() {
    return descripcion;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }
}