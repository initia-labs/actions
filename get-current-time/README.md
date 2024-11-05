# get-current-time

A github action that sets the curent ISO8601 time with formated value. It is used to obtain build time or the time of a specific event.

## Example usage
```yaml
    steps:
      - name: Get current time
        uses: initia-labs/actions/get-current-time@main
        id: current-time
        with:
            format: YYYY-MM-DDTHH-mm-ss
            
      - name: Copy changed files to ...
        env:
          CURRENT_TIME: ${{ steps.current-time.outputs.formattedTime }}
```

## Variables
* format [optional]: time format to use
* timezone [optional]: timezone to use
* ustcOffset [optional]: UTC offset to use

## Outputs
* time: ISO time
* formattedTime: formatted time using format and utcOffset varialbes
* year, month, day, hour, minute, second, millisecond: the value representing as its name
