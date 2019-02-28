/*
    SwitchChat Chatbox Module for SwitchCraft

    Copyright (c) 2019 Alessandro "Ale32bit"

    https://github.com/Ale32bit/SwitchChat
 */

module.exports = {
    inArray: function (arr, val) {
        for(let i = 0; i<arr.length; i++){
            if(arr[i] === val) return true
        }
        return false;
    }
};