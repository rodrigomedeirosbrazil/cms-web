import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import graphql from '../services/graphql'

const ITEMS = `
    query {
        items (where: {active: {_eq: true}}, order_by: {idn: asc}) { 
            idn, name, description, quantity, value, picture 
        }
    }
`;

const Catalog = async () => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const _data = await graphql(ITEMS);

    var pdf = {
        content: [{
            text: 'Catálogo de produtos',
            style: 'header'
        }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 3, 0, 2]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    };
    for (let i=0; i < _data.items.length; i++) {
        let item = _data.items[i];
        if (item.picture === '') {
            item.picture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNzIxNUREQjk2Q0QxMUU2QTVFNzkyODBBMTMyMTVGQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNzIxNUREQzk2Q0QxMUU2QTVFNzkyODBBMTMyMTVGQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY3MjE1REQ5OTZDRDExRTZBNUU3OTI4MEExMzIxNUZBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY3MjE1RERBOTZDRDExRTZBNUU3OTI4MEExMzIxNUZBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZCbqtgAAAAxQTFRFzMzMmZmZ////5ubmmVlPSwAABI1JREFUeNrs3dtu4zAMBFBa8///vF00KRxHFGeomxHET4tFbZ9SF1uWxFq5+WFf4Bf4MUAUPI6ff94K+EOy2vGfuhvo0F6Z24Ax7g+5AcjrOo22QtdjTAAtfWAF0PoOzAXC+g9MBEYdyt/R/sFZQLWrazhnAJHrhr2nzHBgx0OibhwL7K5JSAfRcj6M6NxHAdEXvMaFMASIkU9+/Vo24ZrK5bqBY3mJAjHlamNe5bWLmnCpceMMQWi0b+RISLiysVcZO5jkhbbFdy1mJICYVbziDWyXj72FUQ2tzBeKwEFPX6UiSkCzNUIihsa+Pc+PIWgg+oc6qRiCBY4YjKWEJPD8O+0XWusEXKI5XQgGeAEtEDaroQW+1cIQWIn3UiEiYO1H5wvhX9+YYM8X+td3gX7POFnYBLp1YbrQLWRjq8JsoRcbIxvTdKEXHOMCuEDoRMeYiuoK7SCOvnZSBaKwQgYIuZAdIMIRTFLYFUKjSzgvxBggmBaQE8ohRA3INdGUsCeERjeRHmFHMzGphLNC5MvYxAAmhfkQssDzfRzhc5ECYOmG4wOjEj4C4dtbUicQV2BUwkckfC+uDPA9TubGtg5URlKWqJUeECxQiWEliGYsEA4QIbAl/F14VD/t2dugCYQDNAF4hL3NuRt77w1BAc0BFgJoRH8IN/SP/ypkJcwAiRheOaff6xFVDQgRSAlR7wBYIKpAkEBFaFIRYxDQBKHSSBxg/Cbj9bRMPYTQzbxZ8kBBKHTUI4F8b2PKC9joCAbC8GwKiC5gU4g8EJUIQgAa9Y5tXhkXshkb18uU9jijIfTeDWNgGQIM23Ie2BvB550DIZrd6ApgINwMtLDHvkEE20K7A7AlxLZGci67xlOvbIsghPFyb0fd8SQxSjjsSaI/i0GNl3e+zRzMN4c9QLs+xaTZigXAg//msAmIHqEG1Ed1tTEROdY7lgw7XzyZGCaBJgFfR7qaUPuyUJLAQ/k6JwLLEODx/q2SrIdZIETgeSpNiqH4fRBZ4OudgNOGSe7rHPmFVfhGnejR/BE9/Y26dAAPywjFr/z0PIk2FxeNl4V5EnKmiY5i2JbVmabSCfydqyunubpAqM7VcZOJ0tEWsjPa7HzxMVoozxcHIcwAm/VQnnEP1iwcx+AY6msW2mXctROWmF8mVn0IiwLkg1v3FS3soZdVzBJWI1QF7hEKi8vmrr6LV9d5QGwVEusHy9xNQm0hswJzcgjbQmoN6+QQtoTcKuDJ7aQl1Bd6rxXSK9FnF7Ij5NfyB7tPZgmF3RDTC7n65iDsJ9khbN4x2tO0QAgRGO/FGyuUd4UtF8r76sK9eLOE9M7ETUJ+b+fr6ctKuQjAYutjWCTg+hgWEXj7Pe63zxJw/zwLk4UDMlXcP9fH/bOl3D/fTFmQsSeM9qAOf/DzQwDePmvUwLxbqfRin5C5rPSkbnucPzn3m5P+A2XByR+Tf7CMzOCoVI8dOTCl6vtZWUTjKO7Ow9pJXJLJNl/Sy3IBp4xrsymrxh35qKOuTk3WOgn4UN43J/qrc0pa+e8fDvgCdx//BBgADNyYCLM3ltUAAAAASUVORK5CYII=';
        }
        if (!item.height) item.height = '-';
        if (!item.width) item.width = '-';
        if (!item.length) item.length = '-';
        pdf.content.push({
            columns: [{
                image: item.picture,
                width: 100,
                margin: [0, 5]
            }, {
                width: 10,
                text: ''
            },
            [
                {
                    text: item.name + ' #' + item.idn,
                    style: 'subheader',
                },
                `R$ ${item.value}`,
                `Altura: ${item.height} cm - Largura: ${item.width} cm - Profundidade: ${item.length} cm`,
                `Descrição: ${item.description}`,
            ]

            ]
        },
        {
            text: '',
            pageBreak: (((i + 1) % 6) === 0 ? 'after' : ''),
        })
    }

    pdfMake.createPdf(pdf).download('catalogo.pdf');
}

export default Catalog;
