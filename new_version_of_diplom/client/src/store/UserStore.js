import {makeAutoObservable} from 'mobx';

export default class UserStore {
    constructor()
    {
        this._isAuth = false
        this._data = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) { this._isAuth = bool }
    setData(user) { this._data = user }

    get isAuth() { return this._isAuth }
    get data() { return this._data }
}