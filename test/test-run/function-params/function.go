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

/**
 * @Description:
 * @Param  a string
 * @Param  b int
 * @Param  c *gin.Context
 * @Param  d []string
 * @Param  e [][]string
 * @Param  f map[string]interface{}
 * @Param  m map[string][2]int
 * @Param  g ...chan int
 * @Return * <-chan
 * @Return * interface{}
 * @Return * interface{}
 * @Return * map[string][2]int
 * @Return * http.Cookie
 * @Return * error
 * @Author yaoshaochen
 * @Date   2024-07-17 18:45:11
 */
func FooWithoutName(a string, b int, c *gin.Context, d []string, e [][]string, f map[string]interface{}, m map[string][2]int, g ...chan int) (<-chan interface{}, interface{}, map[string][2]int, http.Cookie, error) {
	return nil, nil, nil, http.Cookie{}, nil
}

func Footest() (int, int) {
	return 1, 1
}

/**
 * @Description:
 * @Param  a string
 * @Param  b int
 * @Param  c *gin.Context
 * @Param  d []string
 * @Param  e [][]string
 * @Param  f map[string]interface{}
 * @Param  m map[string][2]int
 * @Param  g ...chan int
 * @Return h <-chan interface{}
 * @Return i interface{}
 * @Return j http.Cookie
 * @Return k http.Cookie
 * @Return l http.Cookie
 * @Return n http.Cookie
 * @Return o http.Cookie
 * @Return err error
 * @Author yaoshaochen
 * @Date   2024-07-17 18:44:49
 */
func StayHungryStayFoolish(a string, b int, c *gin.Context, d []string, e [][]string, f map[string]interface{}, m map[string][2]int, g ...chan int) (h <-chan interface{}, i interface{}, j, k, l, n, o http.Cookie, err error) {
	return
}

/**
 * @Description:
 * @Param  a int
 * @Param  b int
 * @Param  c int
 * @Param  d int
 * @Param  e int
 * @Param  f int
 * @Param  g int
 * @Return err error
 * @Author yaoshaochen
 * @Date   2024-07-17 18:45:01
 */
func StayHungryStayFoolish2(a, b, c, d, e, f, g int) (err error) {
	return
}
