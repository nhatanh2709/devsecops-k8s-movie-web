resource "aws_customer_gateway" "customer_gateway" {
    
    bgp_asn    = 65000
    ip_address = var.ip_address
    type       = "ipsec.1"
    tags       = {
        Name = var.customer_gateway_name
    }
}

resource "aws_vpn_gateway" "vpn_gateway" {
    vpc_id = aws_vpc.custom_vpc.id
    tags   = {
        Name = var.vpn_gateway_name
    }
}

resource "aws_vpn_connection" "vpn_connection" {
  vpn_gateway_id      = aws_vpn_gateway.vpn_gateway.id
  customer_gateway_id = aws_customer_gateway.customer_gateway.id
  type                = "ipsec.1"
  static_routes_only  = true
  tags                = {
        Name = var.vpn_site_to_site_connection
  }
}

resource "aws_vpn_connection_route" "vpn_connection" {
  destination_cidr_block = "192.168.0.0/16"  
  vpn_connection_id      = aws_vpn_connection.vpn_connection.id
}

resource "aws_vpn_gateway_route_propagation" "public_route_propagation" {
  count          = length(var.networking.public_subnets)
  vpn_gateway_id = aws_vpn_gateway.vpn_gateway.id
  route_table_id = aws_route_table.public_table[count.index].id
}

resource "aws_vpn_gateway_route_propagation" "private_route_propagation" {
  count          = length(var.networking.private_subnets)
  vpn_gateway_id = aws_vpn_gateway.vpn_gateway.id
  route_table_id = aws_route_table.private_tables[count.index].id
}