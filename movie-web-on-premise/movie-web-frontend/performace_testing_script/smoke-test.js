import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
export let options = {
        vus: 1,
        duration: '10s',
};

export default function() {
         let res = http.get('http://movie-web-frontend.nhatanhdevops.com');
        check(res, {'status was 200': (r) => r.status === 200});
        sleep(1);
}

export function handleSummary(data) {
    return {
        // Tạo một file HTML để lưu báo cáo
        "/performace_testing_script/summary.html": htmlReport(data)
    };
}
