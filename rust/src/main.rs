use actix_web::{App, HttpResponse, HttpServer, get};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server started ad 0.0.0.0:8097");
    HttpServer::new(move || App::new().service(handler))
        .bind(("0.0.0.0", 8097))?
        .run()
        .await
}

#[get("process")]
async fn handler() -> HttpResponse {
    let input = 5.0;

    let req_id: u32 = rand::random();

    let h1 = tokio::task::spawn_blocking(move || complex_calculation_1(input));
    let h2 = tokio::task::spawn_blocking(move || complex_calculation_2(input));
    let h3 = tokio::task::spawn_blocking(move || complex_calculation_3(input));

    let (r1, r2, r3) = tokio::join!(h1, h2, h3);

    let r1 = r1.unwrap();
    let r2 = r2.unwrap();
    let r3 = r3.unwrap();

    HttpResponse::Ok().json(serde_json::json!({
        "result": r1 + r2 + r3,
        "id": req_id,
        "tasks": {
            "task1": (r1 * 1000000.0).round() / 1000000.0,
            "task2": (r2 * 1000000.0).round() / 1000000.0,
            "task3": (r3 * 1000000.0).round() / 1000000.0,
        },
    }))
}

fn complex_calculation_1(data: f64) -> f64 {
    let mut result = data * 2.0 + data.sin() * data.cos();

    for i in 0..1000 {
        result += (data + i as f64 * 0.001).sin() * (data - i as f64 * 0.001).cos();
    }

    result
}

fn complex_calculation_2(data: f64) -> f64 {
    let mut result = data.powf(3.0) + data.sqrt() + (data + 1.0).ln();

    for i in 0..500 {
        result += (data + i as f64 * 0.01).sqrt() * (data - i as f64 * 0.005 + 1.0).ln();
    }

    result
}

fn complex_calculation_3(data: f64) -> f64 {
    let mut result = data.powf(2.0) + data * 10.0 + 100.0;

    for i in 0..2000 {
        result += (data + i as f64 * 0.0001) * (data - i as f64 * 0.0002);
    }

    result
}
