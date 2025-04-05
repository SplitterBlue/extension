<script>
    export let events = []; // Array of events to display
</script>

<style>
    .calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        text-align: center;
    }

    .day {
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
    }

    .event {
        margin-top: 5px;
        background-color: #f0f8ff;
        padding: 5px;
        border-radius: 3px;
        font-size: 0.9em;
    }
</style>

<div class="calendar">
    {#each Array(7 * 5) as _, i}
        <div class="day">
            <div>Day {i + 1}</div>
            {#each events.filter(event => event.day === i + 1) as event}
                <div class="event">{event.title}</div>
            {/each}
        </div>
    {/each}
</div>