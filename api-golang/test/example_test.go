package test

import "testing"

func TestValues(t *testing.T) {
	tests := []struct {
		name string
		val  int
		want int
	}{
		{"equal one", 1, 1},
		{"also equal one", 1, 1},
	}

	for _, tt := range tests {
		tt := tt // защита от замыкания переменной в цикле
		t.Run(tt.name, func(t *testing.T) {
			if tt.val != tt.want {
				t.Errorf("❌ got %d, want %d", tt.val, tt.want)
			} else {
				t.Logf("✅ %s passed", tt.name)
			}
		})
	}
}
