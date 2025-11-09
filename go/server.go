package main

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"runtime"
	"time"
)

type ResponseBody struct {
	Result float64            `json:"result"`
	ID     int                `json:"id"`
	Tasks  map[string]float64 `json:"tasks"`
}

func complexCalculation1(data float64) float64 {
	result := float64(data)*2 + math.Sin(data)*math.Cos(data)

	for i := 0; i < 1000; i++ {
		result += math.Sin(data+float64(i)*0.001) * math.Cos(data-float64(i)*0.001)
	}

	return result
}

func complexCalculation2(data float64) float64 {
	result := math.Pow(data, 3) + math.Sqrt(data) + math.Log(float64(data)+1)

	for i := 0; i < 500; i++ {
		result += math.Sqrt(data+float64(i)*0.01) * math.Log(data-float64(i)*0.005+1)
	}

	return result
}

func complexCalculation3(data float64) float64 {
	result := math.Pow(data, 2) + float64(data)*10 + 100

	for i := 0; i < 2000; i++ {
		result += (data + float64(i)*0.0001) * (data - float64(i)*0.0002)
	}

	return result
}

func processRequest(w http.ResponseWriter, r *http.Request) {

	rnd := rand.New(rand.NewSource(time.Now().UnixNano()))

	input := 5.0
	reqId := rnd.Intn(40000000-30000000+1) + 30000000

	ch1 := make(chan float64, 1)
	ch2 := make(chan float64, 1)
	ch3 := make(chan float64, 1)

	go func() {
		ch1 <- complexCalculation1(input)
	}()

	go func() {
		ch2 <- complexCalculation2(input)
	}()

	go func() {
		ch3 <- complexCalculation3(input)
	}()

	result1 := <-ch1
	result2 := <-ch2
	result3 := <-ch3

	totalResult := result1 + result2 + result3

	tasks := map[string]float64{
		"task1": math.Round(result1*1000000) / 1000000,
		"task2": math.Round(result2*1000000) / 1000000,
		"task3": math.Round(result3*1000000) / 1000000,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseBody{
		Result: totalResult,
		ID:     reqId,
		Tasks:  tasks,
	})
}

func main() {

	mux := http.NewServeMux()
	mux.HandleFunc("/process", processRequest)

	server := &http.Server{
		Addr:         ":8097",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
	}

	fmt.Println("Server started on http://127.0.0.1:8097")
	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
