import dat from './data/data.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const objContainer = document.querySelector(".container"),
        logoBut = document.querySelector(".logo"),
        tabBut = document.querySelectorAll('.tab-button'),
        leftDiv = document.querySelector('.left');
    let checkSort = false,
        objForSort = dat.mow.slice();

    // Функция для сортировки рандомно выбранных карточек из фильтра
    // Принимает в себя массив объектов "info" 

    const addSortObj = (info) => {
        let sortObj = info.slice();
        tabBut.forEach(item => {
            let propSort;
            if(item.classList.contains('sort-top'||'sort-down')){
                propSort = item.id == 'fast' ?  'timeInWay' : 'price';
                
            sortObj.sort((a, b) => {
                if (a[propSort] > b[propSort]) {
                    return checkSort ? -1 : 1;
                }
                if (a[propSort] < b[propSort]) {
                    return checkSort ? 1 : -1;
                }
                return 0;
            })} 
        })
        return sortObj;
    };


    // Функция заполнения карточек (.element) в div (.container)
    // Принимает в себя массив объектов "info" 
    const createNewLot = info => {
        objContainer.innerHTML = "";
        const object = addSortObj(info)
        for (const i of object) {
            const price = i.price,
             time = i.time,
             timeInWay = i.timeInWay,
             peresadki = i.peresadki,
             div = document.createElement('div');

            div.className = "element";
            div.innerHTML = `<div class="top"><div class="price">  ${price} RUB </div>
        <div class="logo-card"></div></div>
        <div class="grid">
        <div class="grid-item"><div class="top-text">mow - hkt</div>
        <div class="down-text"> ${time} </div>
        </div> 
        <div class="grid-item"><div class="top-text">в пути</div>
        <div class="down-text"> ${timeConverter(timeInWay)} </div>
        </div><div class="grid-item">
        <div class="top-text">${peresadki.length ? "Кол-во пересадок " + peresadki.length  :"Без пересадок"}</div>
        <div class="down-text"> ${peresadki} </div>`;
            objContainer.appendChild(div)
        }
    };

    // Функция конвертации времени из секунд в формат x д. x ч. xx м.
    // Минуты кратны 15 
    const timeConverter = sec => {
        let d = sec / 86400 ^ 0,
            h = (sec - d * 86400) / 3600 ^ 0,
            m = (sec - d * 86400 - h * 3600) / 60 ^ 0;
        if (m < 15) m = 15
        else if (m < 30) m = 30
        else if (m < 45) m = 45
        else m = 0
        let timeStr = (d == 0 ? "" : d + " д. ") + h + " ч. " + (m < 10 ? "0" + m : m) + " м. ";
        return timeStr;
    }

    // Функция фильтрации карточек по количеству пересадок
    // Принимает в себя checkbox (event.target чекбокса)
    // Если ни один фильтр не выбран, рисуются все карточки
    const filterCards = checkbox => {
        const radioBut = document.querySelectorAll(".left-input"),
            allBut = document.querySelector(".all");

        objForSort = [];
        let unCheck = 0;

        radioBut.forEach(item => {
            let index;
            if (item.checked == true) {
                unCheck++;
                if (checkbox.nextSibling.nodeValue.split(" ")[0] === "Все") {
                    radioBut.forEach(function(item) {
                        item.checked = allBut.checked;
                    });
                    objForSort = dat.mow;
                } else if (item.nextSibling.nodeValue.split(" ")[0] === "Без") {
                    index = 0;
                } else {
                    index = item.nextSibling.nodeValue.split(" ")[0]
                }
                for (var j = 0; j < dat.mow.length; j++) {

                    if (dat.mow[j].peresadki.length == index) {
                        objForSort.push(dat.mow[j])
                    }
                }
            } else {
                allBut.checked = false
            }

        });

        objForSort = unCheck == 0 ? objForSort = dat.mow : objForSort ;
        createNewLot(objForSort);
    };


    
    createNewLot(dat.mow);

    //Событие нажатие на логотип
    //Вся форма возвращается к исзодному виду
    logoBut.addEventListener("click", () => {
            tabBut.forEach((item) => {
                item.classList.remove('sort-top');
                item.classList.remove('sort-down');
            });

            document.querySelectorAll('.left-input').forEach((item) => {
                item.checked = false
            })
        
        createNewLot(dat.mow)
    });

    // Событие на выделения и снятие выделения в checkbox
    leftDiv.addEventListener('click', e => {
        const checkbox = e.target.closest("label").lastElementChild;
        if (e.target != checkbox) {
            checkbox.checked = checkbox.checked ? false : true;
        }
        filterCards(checkbox);
    })

    // Вешается событие клика на кнопки "По цене" и "По времени"
    // Содержит в себе функцию сортировки по времени и по цене 
    // Принимает event класса .tab-button
    // Содержит гллобальную переменную checkSort для регулировки сортировки(по возрастанию, по убыванию)  
    tabBut.forEach(item => {
        item.addEventListener("click", event => {
            const sortId = event.target.id;
            let propSort;
            tabBut.forEach((item) => {
                item.classList.remove('sort-top');
                item.classList.remove('sort-down');
            });
            event.target.classList.add(checkSort ? 'sort-top' : 'sort-down')


            propSort = sortId == 'fast' ?  'timeInWay' : 'price';
            let sortObj = objForSort.slice();

            checkSort = !checkSort;

            sortObj.sort((a, b) => {
                if (a[propSort] > b[propSort]) {
                    return checkSort ? -1 : 1;
                }
                if (a[propSort] < b[propSort]) {
                    return checkSort ? 1 : -1;
                }
                return 0;
            })

            createNewLot(sortObj)
        });
    })

})




   