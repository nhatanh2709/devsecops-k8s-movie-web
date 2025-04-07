output "fis_experiment_role_name" {
    description = "The name of the FIS experiment IAM role"
    value       = aws_iam_role.fis_experiment_role.name
}