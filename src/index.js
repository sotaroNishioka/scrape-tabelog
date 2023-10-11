"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const jsdom_1 = require("jsdom");
const db_1 = require("./db");
const getDoms = (prefecture) => __awaiter(void 0, void 0, void 0, function* () {
    // ページ取得
    const response = yield (0, node_fetch_1.default)(`https://tabelog.com/${prefecture.roma}/`);
    const body = yield response.text();
    const dom = new jsdom_1.JSDOM(body);
    return dom;
});
const getLinkContents = (dom) => {
    const tab = dom.window.document.body.querySelector('#tabs-panel-balloon-pref-area');
    if (tab === null) {
        throw new Error('#tabs-panel-balloon-pref-area is not found');
    }
    // エリアから探すの要素取得
    const cities = tab.querySelector('.list-balloon__list');
    if (cities === null) {
        throw new Error('.list-balloon__list is not found');
    }
    // エリアから探すのカラムをすべて取得
    const cols = cities.querySelectorAll('.list-balloon__list-col');
    if (cols === null) {
        throw new Error('.list-balloon__list-col is not found');
    }
    const items = Array.from(cols).map((col) => {
        const linkItem = col.querySelectorAll('.list-balloon__list-item');
        if (linkItem === null) {
            throw new Error('.list-balloon__list-item is not found');
        }
        return Array.from(linkItem);
    });
    const res = items.flat();
    return res;
};
const getDetails = (linkContents, prefecture) => {
    const res = linkContents.map((link) => {
        const aDom = link.querySelector('.c-link-arrow');
        if (aDom === null) {
            throw new Error('.c-link-arrow is not found');
        }
        const hrefVal = aDom.getAttribute('href') === null ? '' : aDom.getAttribute('href');
        if (hrefVal === null) {
            throw new Error('hrefVal is not found');
        }
        const code = hrefVal.split('/')[4];
        const nameDom = aDom.querySelector('span');
        if (nameDom === null) {
            throw new Error('nameDom is not found');
        }
        const nameVal = (nameDom === null || nameDom === void 0 ? void 0 : nameDom.textContent) === null ? '' : nameDom.textContent;
        const obj = {
            name: nameVal,
            url: hrefVal,
            code,
            prefectureRoma: prefecture.roma,
            prefectureName: prefecture.kanji
        };
        return obj;
    });
    return res;
};
const getPrefectures = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, db_1.connect)();
    try {
        const { rows } = yield client.query('SELECT id, kanji, yomi, roma FROM prefecture');
        return rows;
    }
    catch (err) {
        console.error(err);
        throw new Error('DB Error');
    }
    finally {
        yield client.end();
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const prefectures = yield getPrefectures();
    const detailings = prefectures.map((prefecture) => __awaiter(void 0, void 0, void 0, function* () {
        const dom = yield getDoms(prefecture);
        const linkContents = getLinkContents(dom);
        const details = getDetails(linkContents, prefecture);
        return details;
    }));
    const details = (yield Promise.all(detailings)).flat();
    console.log(details);
});
void main();
