package types

type Response struct {
	Message string `json:"message" description:"Message of the response"`
}

type ApiError struct {
	Context map[string]string `json:"context,omitempty" description:"Context of the error. Usually used for validation error contexts"`
	Message string            `json:"message" description:"Message of the error"`
}
