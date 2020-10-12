"use strict";

const validator = require("validator");
const fs = require('fs');
const path = require('path');
const Article = require("../models/article");

const controller = {
	datosCurso: (req, res) => {
		var param = req.body.hola;
		return res.status(200).send({
			curso: "Master en Frameworks JS",
			autor: "Victor Robles",
			url: "www.victorroblesweb.es",
			param,
		});
	},

	test: (req, res) => {
		return res.status(200).send({
			message: "Soy la accion test de mi controlador de articulos",
		});
	},

	save: (req, res) => {
		// Recoger parametros por POST
		const params = req.body;

		// Validar datos (validator)
		try {
			var validate_title = !validator.isEmpty(params.title); //true or false
			var validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(200).send({
				status: "error",
				message: "Faltan datos por enviar...",
			});
		}

		if (validate_title && validate_content) {
			// Crear el objeto a guardar
			const article = new Article();

			// Asignar valores
			article.title = params.title;
			article.content = params.content;
			article.image = null;

			// Guardar el articulo
			article.save((err, articleStored) => {
				if (err || !articleStored) {
					return res.status(404).send({
						status: "error",
						message: "El articulo no se ha guardado.",
					});
                }
                
				// Devolver una respuesta positiva
				return res.status(200).send({
					status: "success",
					article: articleStored
				});
			});
		} else {
			return res.status(200).send({
				status: "error",
				message: "Los datos no son válidos.",
			});
		}
    },
    
    getArticles: (req, res) => {
        
        const query = Article.find({});

        const last = req.params.last;
        if(last || last != undefined) {
            query.limit(2);
        }

        query.sort('-_id').exec((err, articles) => {

            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            })
        })
    },

    getArticle: (req, res) => {
        const articleId = req.params.id;

        if(!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo.'
            });
        }
        Article.findById(articleId, (err, article) => {
            
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo.'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req, res) => {
        // Recoger id de la url
        const articleId = req.params.id;

        // Recoger los datos que llegan por put
        const params = req.body;

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch(err) {
            res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            });
        }

        if (validate_title && validate_content) {
            // Buscar el articulo por _id
            Article.findOneAndUpdate({_id: articleId}, params, { new: true }, (err, articleUpdate) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if (!articleUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdate
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }

    },

    delete: (req, res) => {
        const articleId = req.params.id;
        Article.findOneAndDelete({_id: articleId}, (err, articleRemove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }

            if (!articleRemove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha encontrado el articulo, posiblemente no existe.'
                });
            }

            return res.status(200).send({
                status: 'success',
                message: articleRemove
            });
        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y extension del archivo
        const file_path = req.files.file0.path;
        const file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extension del fichero
        const extension_split = file_name.split('.');
        const file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // Borrar el archivo
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida.'
                });
            });

        } else {
            // Si es valido, sacer id de la url
            const articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                
                if (err || !articleUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al intentar guardar la imagen'
                    });
                }
                
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });

            
        }
    },

    getImage: (req, res) => {
        const file = req.params.image;
        const path_file = './upload/articles/'+file;

        if (fs.existsSync(path_file)) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe'
            });
        }
    },

    search: (req, res) => {
        // Sacar el string a buscar
        const searchString = req.params.search;

        // Find or
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                   status: 'error',
                   message: 'Error en la petición' 
                });
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                   status: 'error',
                   message: 'No hay articulos que coincidan con tu busqueda' 
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })

    },
};

module.exports = controller;
