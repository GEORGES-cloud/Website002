# -*- coding: utf-8 -*-
"""Contenido de las cartas, en espanol y en ingles.

Los tres menus de empresa no se llaman A, B y C: cada uno lleva el nombre de
algo que es de la casa —la brasa de encina, el jardin de palmeras y el propio
Zenorio— y van de menos a mas. El nombre no se traduce (es un nombre propio);
lo que cambia de idioma es el subtitulo.

Cada carta declara su "tema", que es lo que le da el ambiente: la orla del
borde y el tono del papel y la tinta. Los temas estan dibujados en
ornamento.py y pintados en menus.css.

Los titulos van en caja alta y baja, NO en versales: se componen en
Pinyon Script, una inglesa de plumilla, y una inglesa en mayusculas no se
lee —las capitales son pura floritura y "LA ENCINA" salia ilegible—.

Un plato es (nombre, segunda linea). La segunda linea es el nombre tematico
entre comillas en la de Halloween y la descripcion en la de Nochevieja; en
las de empresa va vacia. Si algun dia cambia un plato o un precio, se cambia
aqui y se vuelve a lanzar generar.py: el diseno no se toca.
"""

PIE = {
    "es": ["AVD. LOS GIRASOLES 108, NUEVA ANDALUCÍA, MARBELLA",
           "WWW.ZENORIO.ES", "+34 625 84 89 36"],
    "en": ["AVD. LOS GIRASOLES 108, NUEVA ANDALUCÍA, MARBELLA",
           "WWW.ZENORIO.ES", "+34 625 84 89 36"],
}

CARTAS = [
    # ------------------------------------------------------------------ empresa
    {
        "slug": "empresa",
        "tema": "grupos",
        "formato": "a4",
        "origen": "menu-empresa-es.pdf",
        "nombre": {"es": "MENÚ DE EMPRESA", "en": "COMPANY MENU"},
        "paginas": [
            {
                "titulo": {"es": "La Encina", "en": "La Encina"},
                "subtitulo": {"es": "La mesa de la brasa", "en": "The ember table"},
                "secciones": [
                    {"ttl": {"es": "AL CENTRO DE LA MESA", "en": "TO SHARE AT THE TABLE"},
                     "platos": [
                         ({"es": "Gambas cocidas", "en": "Boiled prawns"}, None),
                         ({"es": "Croquetas cremosas", "en": "Creamy croquettes"}, None),
                         ({"es": "Ensaladilla rusa", "en": "Russian salad"}, None),
                     ]},
                    {"ttl": {"es": "ENTRANTE", "en": "STARTER"},
                     "platos": [
                         ({"es": "Bisque de marisco", "en": "Shellfish bisque"}, None),
                     ]},
                    {"ttl": {"es": "PRINCIPAL", "en": "MAIN COURSE"},
                     "nota": {"es": "a elegir", "en": "choose one"},
                     "platos": [
                         ({"es": "Entrecot a la crema de champiñones",
                           "en": "Entrecôte with mushroom cream"}, None),
                         ({"es": "Salmón a la lima", "en": "Salmon with lime"}, None),
                     ]},
                    {"ttl": {"es": "POSTRE", "en": "DESSERT"},
                     "platos": [
                         ({"es": "Brownie con helado de vainilla",
                           "en": "Brownie with vanilla ice cream"}, None),
                     ]},
                ],
                "incluye": {"es": "Incluye agua, cerveza, vino y café",
                            "en": "Includes water, beer, wine and coffee"},
                "precio": "55 €",
            },
            {
                "titulo": {"es": "El Jardín", "en": "El Jardín"},
                "subtitulo": {"es": "La mesa de las palmeras", "en": "The garden table"},
                "secciones": [
                    {"ttl": {"es": "AL CENTRO DE LA MESA", "en": "TO SHARE AT THE TABLE"},
                     "platos": [
                         ({"es": "Gambas cocidas", "en": "Boiled prawns"}, None),
                         ({"es": "Croquetas cremosas", "en": "Creamy croquettes"}, None),
                         ({"es": "Jamón ibérico de bellota", "en": "Acorn-fed Iberian ham"}, None),
                         ({"es": "Salmón marinado", "en": "Marinated salmon"}, None),
                     ]},
                    {"ttl": {"es": "ENTRANTE", "en": "STARTER"},
                     "platos": [
                         ({"es": "Sopa de almejas y gambas", "en": "Clam and prawn soup"}, None),
                     ]},
                    {"ttl": {"es": "PRINCIPAL", "en": "MAIN COURSE"},
                     "nota": {"es": "a elegir", "en": "choose one"},
                     "platos": [
                         ({"es": "Solomillo a la pimienta", "en": "Peppercorn beef tenderloin"}, None),
                         ({"es": "Rodaballo al horno", "en": "Oven-baked turbot"}, None),
                     ]},
                    {"ttl": {"es": "POSTRE", "en": "DESSERT"},
                     "platos": [
                         ({"es": "Lemon pie", "en": "Lemon pie"}, None),
                     ]},
                ],
                "incluye": {"es": "Incluye agua, cerveza, vino y café",
                            "en": "Includes water, beer, wine and coffee"},
                "precio": "75 €",
            },
            {
                "titulo": {"es": "El Zeñorío", "en": "El Zeñorío"},
                "subtitulo": {"es": "La mesa de la casa", "en": "The house table"},
                "secciones": [
                    {"ttl": {"es": "AL CENTRO DE LA MESA", "en": "TO SHARE AT THE TABLE"},
                     "platos": [
                         ({"es": "Jamón ibérico de bellota", "en": "Acorn-fed Iberian ham"}, None),
                         ({"es": "Brioche de steak tartar y trufa",
                           "en": "Brioche with steak tartare and truffle"}, None),
                         ({"es": "Vieira, ibérico y beurre blanc",
                           "en": "Scallop, Iberian ham and beurre blanc"}, None),
                     ]},
                    {"ttl": {"es": "ENTRANTE", "en": "STARTER"},
                     "platos": [
                         ({"es": "Ravioli de bogavante", "en": "Lobster ravioli"}, None),
                     ]},
                    {"ttl": {"es": "PRINCIPAL", "en": "MAIN COURSE"},
                     "nota": {"es": "a elegir", "en": "choose one"},
                     "platos": [
                         ({"es": "Lomo de lubina salvaje", "en": "Wild sea bass loin"}, None),
                         ({"es": "Solomillo de ternera, foie y trufa",
                           "en": "Beef tenderloin, foie gras and truffle"}, None),
                     ]},
                    {"ttl": {"es": "POSTRE", "en": "DESSERT"},
                     "platos": [
                         ({"es": "Oro, chocolate y champagne",
                           "en": "Gold, chocolate and champagne"}, None),
                     ]},
                ],
                "incluye": {"es": "Incluye agua, cerveza, vino y café",
                            "en": "Includes water, beer, wine and coffee"},
                "precio": "95 €",
            },
        ],
    },
    # ---------------------------------------------------------------- halloween
    {
        "slug": "halloween",
        "tema": "halloween",
        "formato": "cartel",
        "origen": "menu-halloween-en.pdf",
        "nombre": {"es": "CENA DE HALLOWEEN", "en": "HALLOWEEN DINNER"},
        "paginas": [
            {
                "titulo": {"es": "Halloween", "en": "Halloween"},
                "subtitulo": {"es": "Cena del 31 de octubre", "en": "Dinner · 31 October"},
                "secciones": [
                    {"ttl": {"es": "ENTRANTES", "en": "STARTERS"},
                     "nota": {"es": "a elegir uno", "en": "choose one"},
                     "platos": [
                         ({"es": "Carpaccio de atún", "en": "Tuna carpaccio"},
                          {"es": "«Rojo de medianoche»", "en": "“Midnight Red”"}),
                         ({"es": "Ensalada de aguacate y gambas", "en": "Avocado and prawn salad"},
                          {"es": "«Jardín encantado»", "en": "“Enchanted Garden”"}),
                         ({"es": "Ensalada de tres tomates con burrata",
                           "en": "Three-tomato salad with burrata"},
                          {"es": "«El jardín de sangre»", "en": "“The Blood Garden”"}),
                     ]},
                    {"ttl": {"es": "PRINCIPALES", "en": "MAIN COURSES"},
                     "nota": {"es": "a elegir uno", "en": "choose one"},
                     "platos": [
                         ({"es": "Solomillo a la pimienta", "en": "Peppercorn beef tenderloin"},
                          {"es": "«Fuego de la noche»", "en": "“Fire of the Night”"}),
                         ({"es": "Rodaballo a la lima", "en": "Turbot with lime"},
                          {"es": "«Hechizo del mar»", "en": "“Spell of the Sea”"}),
                         # El PDF original repetia aqui el nombre del plato como
                         # si fuera el nombre tematico ("The Sorcerer's Ravioli"
                         # dos veces). Se deja solo el plato.
                         ({"es": "Ravioli del hechicero", "en": "The Sorcerer’s Ravioli"}, None),
                     ]},
                    {"ttl": {"es": "POSTRE", "en": "DESSERT"},
                     "platos": [
                         ({"es": "Tarta de queso", "en": "Cheesecake"},
                          {"es": "«Dulce tentación»", "en": "“Sweet Temptation”"}),
                     ]},
                ],
                "incluye": {"es": "Incluye agua, cerveza y vino blanco o tinto",
                            "en": "Includes water, beer and white or red wine"},
                "precio": "75 €",
            },
        ],
    },
    # --------------------------------------------------------------- nochevieja
    {
        "slug": "nochevieja",
        "tema": "nochevieja",
        "formato": "a4",
        "origen": "menu-nochevieja.pdf",
        "nombre": {"es": "NOCHEVIEJA 2027", "en": "NEW YEAR’S EVE 2027"},
        "paginas": [
            {
                "titulo": {"es": "Nochevieja", "en": "New Year’s Eve"},
                "subtitulo": {"es": "La última noche del año", "en": "The last night of the year"},
                "secciones": [
                    {"ttl": {"es": "COPA DE BIENVENIDA", "en": "WELCOME DRINK"},
                     "platos": [
                         ({"es": "Champagne y un bocado del chef",
                           "en": "Champagne and a bite from the chef"},
                          {"es": "Una bienvenida delicada para empezar la última noche del año.",
                           "en": "A delicate welcome to start the last night of the year.",
                           "desc": True}),
                     ]},
                    {"ttl": {"es": "AL CENTRO DE LA MESA", "en": "TO SHARE AT THE TABLE"},
                     "platos": [
                         ({"es": "Jamón ibérico de bellota", "en": "Iberian acorn-fed ham"},
                          {"es": "Cortado fino y servido en su mejor expresión.",
                           "en": "Finely sliced and served at its best expression.",
                           "desc": True}),
                         ({"es": "Brioche de steak tartar y trufa",
                           "en": "Brioche with steak tartare and truffle"},
                          {"es": "Brioche tostado, tartar de ternera y un toque elegante de trufa.",
                           "en": "Lightly toasted brioche, beef tartare and an elegant touch of truffle.",
                           "desc": True}),
                         ({"es": "Vieira, jamón ibérico y beurre blanc",
                           "en": "Scallop, Iberian ham and beurre blanc"},
                          {"es": "Vieira marcada, velo de ibérico y delicada salsa de mantequilla.",
                           "en": "Seared scallop, Iberian ham veil and delicate white butter sauce.",
                           "desc": True}),
                     ]},
                    {"ttl": {"es": "ENTRANTE", "en": "STARTER"},
                     "platos": [
                         ({"es": "Ravioli de bogavante", "en": "Lobster ravioli"},
                          {"es": "Pasta fresca rellena de bogavante, bisque cremosa y un toque cítrico.",
                           "en": "Fresh pasta filled with lobster, creamy shellfish bisque and a hint of citrus.",
                           "desc": True}),
                     ]},
                    {"ttl": {"es": "PRINCIPAL", "en": "MAIN COURSE"},
                     "nota": {"es": "a elegir", "en": "choose one"},
                     "platos": [
                         ({"es": "Lomo de lubina salvaje", "en": "Wild sea bass loin"},
                          {"es": "A la plancha, crema sedosa de patata, verduritas y salsa de champagne.",
                           "en": "Grilled, silky potato cream, baby vegetables and Champagne sauce.",
                           "desc": True}),
                         ({"es": "Solomillo de ternera, foie y trufa",
                           "en": "Beef tenderloin, foie gras and truffle"},
                          {"es": "Foie marinado, parmentier de trufa y jugo de carne reducido.",
                           "en": "Marinated foie gras, truffle parmentier and reduced meat jus.",
                           "desc": True}),
                     ]},
                    {"ttl": {"es": "EL ÚLTIMO POSTRE DEL AÑO", "en": "THE LAST DESSERT OF THE YEAR"},
                     "platos": [
                         ({"es": "Oro, chocolate y champagne",
                           "en": "Gold, chocolate and champagne"},
                          {"es": "Chocolate en varias texturas, avellana tostada y notas de champagne.",
                           "en": "Chocolate in different textures, toasted hazelnut and notes of Champagne.",
                           "desc": True}),
                     ]},
                ],
                "notas": [
                    ({"es": "El primer brindis", "en": "The first toast"},
                     {"es": "12 uvas de la suerte y champagne para brindar por 2027.",
                      "en": "12 lucky grapes and champagne to toast to 2027."}),
                    ({"es": "Y después…", "en": "And afterwards…"},
                     {"es": "DJ session, fiesta y celebración durante toda la noche.",
                      "en": "DJ session, party and celebration throughout the night."}),
                ],
                "precio": "175 €",
            },
        ],
    },
]
