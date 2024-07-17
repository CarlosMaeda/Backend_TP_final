CREATE DATABASE `pf_utn_mysql_db`;


CREATE TABLE `pf_utn_mysql_db`.`uuid_usadas` (
  `ID` INT NOT NULL AUTO_INCREMENT ,
  `UUID` VARCHAR(100) NOT NULL COMMENT 'Se guardan las "UUID" utilizadas para verificar la NO repetición de las mismas.' ,
   PRIMARY KEY (`ID`), UNIQUE `uuid` (`UUID`)
   )

CREATE TABLE `pf_utn_mysql_db`.`roles` (
  `Rol_ID` INT NOT NULL AUTO_INCREMENT ,
  `Rol` VARCHAR(20) NOT NULL DEFAULT 'Usuario',
   PRIMARY KEY (`Rol_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`direcciones` (
  `Direccion_ID` INT NOT NULL AUTO_INCREMENT ,
  `Calle` VARCHAR(50) NOT NULL,
  `Altura` INT NOT NULL,
  `Piso` VARCHAR(15) NULL,
  `Depto` VARCHAR(50) NULL,
  `Localidad` VARCHAR(50) NOT NULL,
  `Provincia` VARCHAR(50) NOT NULL,
  `CP` VARCHAR(20) NOT NULL,
   PRIMARY KEY (`Direccion_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`personas` (
  `Persona_ID` INT NOT NULL AUTO_INCREMENT ,
  `Persona_UUID` VARCHAR(100) NOT NULL,
  `Nombres` VARCHAR(50) NOT NULL,
  `Apellidos` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `Direccion_ID` INT ,
   PRIMARY KEY (`Persona_ID`),
   UNIQUE `uuid` (`Persona_UUID`),
   FOREIGN KEY (`Direccion_ID`) REFERENCES `pf_utn_mysql_db`.`direcciones` (`Direccion_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`usuarios` (
  `Usuario_ID` INT NOT NULL AUTO_INCREMENT ,
  `Persona_UUID` VARCHAR(100) NOT NULL UNIQUE,
  `Username` VARCHAR(50) NOT NULL,
  `Password_hash` VARCHAR(150) NOT NULL,
   PRIMARY KEY (`Usuario_ID`),
   FOREIGN KEY (`Persona_UUID`) REFERENCES `pf_utn_mysql_db`.`personas` (`Persona_UUID`)
)

CREATE TABLE `pf_utn_mysql_db`.`usuarios_roles` (
  `Usuario_Rol_ID` INT NOT NULL AUTO_INCREMENT ,
  `Rol_ID` INT NOT NULL DEFAULT 2 COMMENT 'Rol por defecto = 2, usuario',
  `Usuario_ID` INT NOT NULL,
   PRIMARY KEY (`Usuario_Rol_ID`),
   FOREIGN KEY (`Rol_ID`) REFERENCES `pf_utn_mysql_db`.`roles` (`Rol_ID`),
   FOREIGN KEY (`Usuario_ID`) REFERENCES `pf_utn_mysql_db`.`usuarios` (`Usuario_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`categorias` (
  `Categoria_ID` INT NOT NULL AUTO_INCREMENT ,
  `Categoria` VARCHAR(50) NOT NULL COMMENT 'Se guardan los nombres de las categorías.' ,
   PRIMARY KEY (`Categoria_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`productos` (
  `Producto_ID` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(50) NOT NULL,
  `Descripcion` VARCHAR(255) NOT NULL,
  `Codigo` VARCHAR(50) NOT NULL,
  `Precio` DECIMAL(10,2) NOT NULL,
  `Stock` INT NOT NULL,
  `Imagen` VARCHAR(255) NOT NULL,
  `Fecha_Alta` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  `Categoria_ID` INT NOT NULL,
   PRIMARY KEY (`Producto_ID`),
   FOREIGN KEY (`Categoria_ID`) REFERENCES `pf_utn_mysql_db`.`categorias` (`Categoria_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`carritos` (
  `Carrito_ID` INT NOT NULL AUTO_INCREMENT ,
  `Fecha_Alta` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` ENUM('Procesando', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Procesando',
  `Usuario_ID` INT NOT NULL,
   PRIMARY KEY (`Carrito_ID`),
   FOREIGN KEY (`Usuario_ID`) REFERENCES `pf_utn_mysql_db`.`usuarios` (`Usuario_ID`)
)

CREATE TABLE `pf_utn_mysql_db`.`carritos_productos` (
  `Carrito_Producto_ID` INT NOT NULL AUTO_INCREMENT ,
  `Unidades` INT NOT NULL,
  `Precio` DECIMAL(10,2) NOT NULL,
  `Total` DECIMAL(10,2) GENERATED ALWAYS AS (`Unidades` * `Precio`) STORED COMMENT 'Se calcula de forma automática' ,
  `Carrito_ID` INT NOT NULL,
  `Producto_ID` INT NOT NULL,
   PRIMARY KEY (`Carrito_Producto_ID`),
   FOREIGN KEY (`Carrito_ID`) REFERENCES `pf_utn_mysql_db`.`carritos` (`Carrito_ID`),
   FOREIGN KEY (`Producto_ID`) REFERENCES `pf_utn_mysql_db`.`productos` (`Producto_ID`)
)