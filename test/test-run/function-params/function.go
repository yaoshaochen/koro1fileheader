package main

import "C"
import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/net/trace"
)

// 匿名函数
/**
 * @description:
 * @param {*} a
 * @param {int} b
 * @return {*}
 */
var Add = func(a, b int) int {
	return a + b
}

// 可变数量的参数
/**
 * @description:
 * @param {int} a
 * @param {...int} more
 * @return {*}
 */
func Sum(a int, more ...int) int {
	for _, v := range more {
		a += v
	}
	return a
}

// map参数

/**
 * @description:
 * @param {map[int]int} m
 * @param {int} key
 * @return {*}
 */
func Find(m map[int]int, key int) (value int, ok bool) {
	value, ok = m[key]
	return
}

// 当可变参数是一个空接口类型时，调用者是否解包可变参数会导致不同的结果
/**
 * @description:
 * @param {...interface{}} a
 * @return {*}
 */
func Print(a ...interface{}) {
	fmt.Println(a...)
}

func QueryUsersIDs(cond map[string]interface{}, ans *[]int64, tc *trace.Trace) error {
	return nil
}

func FooWithName(a string, b int, c *gin.Context, d []string, e [][]string, f map[string]interface{}, m map[string][2]int, g ...chan int) (h <-chan interface{}, i interface{}, j, k, l http.Cookie, err error) {
	return
}

func FooWithoutName(a string, b int, c *gin.Context, d []string, e [][]string, f map[string]interface{}, m map[string][2]int, g ...chan int) (<-chan interface{}, interface{}, map[string][2]int, http.Cookie, error) {
	return nil, nil, nil, http.Cookie{}, nil
}

func Footest() (int, int) {
	return 1, 1
}
