---
title: >-
  Aprueban circular relativa al instructivo para el llenado de la DUI. R.l.N.
  N&ordm; 002610 y normas modificatorias y complementarias
identifier: CIRCULAR-INTA-CR-62-2000
country: pe
rank: circular
publication_date: '2000-01-13'
last_updated: '2000-01-13'
status: in_force
source: 'https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H788660'
scope: Nacional
official_journal: El Peruano
---
# Aprueban circular relativa al instructivo para el llenado de la DUI. R.l.N. Nº 002610 y normas modificatorias y complementarias  

## CIRCULAR Nº INTA-CR.62  

     Callao, 11 de enero del 2000

     Señor

     Intendente de Aduana

     Presente

                         ...................................................................................

                         REF.:     Instructivo para el llenado de la DUI. R.I.N.

                               Nº 002610 y normas modificatorias y

                              complementarias

                         ...................................................................................

     Con motivo de la aplicación de las normas del Acuerdo del Valor de la OMC, de conformidad con el Decreto Supremo Nº 186-99-EF y los Procedimientos INTA-PE 01.10 e INTA-PE 01 10a,y estando a la facultad establecida en la Resolución de Superintendencia Nº 001065 de 18.10.99, es necesario implementar cambios en la DUI y en el teledespacho, debiendo hacer de conocimiento de personal de su Intendencia, así como de los Despachadores de Aduana y empresas proveedoras de software, que a partir del 17.ENE.2000 debe observarse lo siguiente:

     1 Respecto al régimen de Importación Definitiva, para el llenado del Formato B en general:

     a) En el espacio entre la Sección:**Identificación y Proveedor del Formato B1**, deben consignarse:

     --**La página web del proveedor**, esta información debe ser transmitida en el campo:**81 PAGWEBPR Carácter de 30 del archivo VALHDR01.TXT.** El envío incorrecto de esta información genera el Código de error**1065: Página web inválida.  
**

     -- El texto**“¿Existen descuentos retroactivos?”**; de ser afirmativa la respuesta se consigna:**“1” caso contrario “2”.** Esta información debe ser transmitida en el campo:**86 PDESRET Carácter de 1 del archivo VALHDR01.TXT** del Teledespacho. El envío incorrecto o no envío de esta información genera el Código de error**1070: Respuesta inválida para los descuentos retroactivos.  
**

     b) La pregunta del rubro 8.5:**“¿Tiene carácter estimativo o provisional los casilleros 8.2.4 y 8.2.5?”** debe reemplazarse por**“Tiene carácter estimativo o provisional el casillero 8.2.4?”**.

     c) Se crea el rubro 8.6:**“¿Tiene carácter estimativo o provisional el casillero 8.2.5?”**, el texto y la respectiva respuesta,**debe aparecer impreso entre la sección 8.5 y la sección 9.** De ser afirmativa la respuesta se consigna:**“1” caso contrario “2”**, la respuesta debe ser transmitida en el campo:**87 PESPRRE Carácter de 1 del archivo VALHDR01.TXT del Teledespacho.** El envío incorrecto o no envío de esta información genera el Código de error**1071: Respuesta inválida para el carácter estimativo o provisional del 8.2.5.  
**

     2. Respecto a las importaciones de mercancías sujetas a la aplicación del Acuerdo del Valor de la OMC, para el llenado del Formato B**además de las instrucciones anteriores, debe observarse lo siguiente:  
**

     a) En el espacio entre la Sección:**Identificación y Proveedor del Formato B1**, debe consignar:

     -- El texto siguiente:**¿Se aproxima mucho el valor de transacción de las mercancías importadas a un valor de los mencionados en el Artículo 1.2 b) del Acuerdo del Valor de la OMC?**; de ser afirmativa la respuesta se consigna “1” caso contrario “2”, esta información deberá ser transmitido en el campo 82 PVATR12B Carácter de 1 del archivo VALHDR01.TXT del Teledespacho. El envío incorrecto o no envío de esta información genera el código de error 1066: Respuesta inválida para el valor de transacción.

     -- El texto:**“¿Existen restricciones para la cesión o utilización de las mercancías por el importador, de acuerdo a lo señalado en el Art. 1 del Acuerdo del Valor de la OMC?”**, de ser afirmativa la respuesta se consigna:**“1” caso contrario “2”**. Esta información debe ser transmitida en el campo:**83 PRECE1 Carácter de 1 del archivo VALHDR01.TXT del Teledespacho.** El envío incorrecto o no envío de esta información genera el Código de error:**1067: Respuesta inválida para las restricciones para la cesión.  
**

     -- El texto:**“¿Depende la venta o el precio de condiciones o contraprestaciones, con relación a las mercancías a valorar?”**; de ser afirmativa la respuesta se consigna:**“1” caso contrario “2”**. Esta información debe ser transmitida en el campo:**84 PCONMCIA Carácter de 1 del archivo VALHDR01.TXT del Teledespacho.** El envío incorrecto o no envío de esta información genera el Código de error**1068: Respuesta inválida para la dependencia del precio de condiciones o contraprestaciones.  
**

     -- El texto:**“¿Puede determinarse el valor de las condiciones o contraprestaciones?”**; de ser afirmativa la respuesta se consigna:**“1” caso contrario “2”**. Esta información debe ser transmitida en el campo:**85 PDECOND Carácter de 1 del archivo VALHDR01.TXT del Teledespacho.** El envío incorrecto o no envío de esta información genera el Código de error**1069: Respuesta inválida para la determinación del valor de las condiciones o contraprestaciones.  
**

     3. Para los regímenes de Importación Definitiva y Depósito, la información del número de**Certificado de Inspección e Informe de Verificación**, se dejarán de enviar en los campos NUME\_CERT1, NUME\_CERT2 y NUME\_CE-RT3 del archivo IMPDET01.TXT en su lugar,**se deberá enviar en un nuevo archivo denominado IMPSUP01.1XT** con la siguiente estructura:

     **CAMPO          TIPO          LONG.          DESCRIPCION  
**

1 CODI\_ADUAN          Carácter       3          Código de Aduana

2 ANO\_PRESE               Carácter       4          Año de la Orden Interna

3 CODI\_REGI               Carácter       2          Código de Régimen

4 NUME\_ORDEN          Carácter       6          Número de Orden Interna

5 NUME\_SERIE          Carácter       4          Número de la Serie

6 CODOCSUP               Carácter       1          Código de Documento

                                        1: Certificado de Inspección

                                        2: Informe de Verificación

7 NUME\_DOCUM          Carácter      18          Número de Certificado de  
                                        Inspección/Informe de

                                        Verificación

8 FECEMDOC               Numérico       8          Fecha de Emisión de Número

                                        de Certificado de

                                        Inspección/Informe de

                                        Verificación

     Atentamente,

     MIGUEL ARRIOLA LUYO

     Intendente Nacional de Técnica Aduanera
