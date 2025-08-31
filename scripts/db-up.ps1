docker compose up -d
Start-Sleep -Seconds 8
Get-Content ./sql/pinto.sql | docker exec -i mysql-pinto mysql -uroot -prootpass
