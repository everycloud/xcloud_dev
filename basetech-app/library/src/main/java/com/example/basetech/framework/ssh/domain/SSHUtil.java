package com.example.basetech.framework.ssh.domain;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.connection.channel.direct.Session.Command;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.example.basetech.framework.ssh.SshClientFactory;
import com.example.basetech.framework.util.StackTraceUtil;

public class SSHUtil {
    private final static Log log = LogFactory.getLog(SSHUtil.class);

    public TaskResult sshExec(List<String> cmds, String host, String username, String password) {
        SSHClient client = null;
        TaskResult result = new TaskResult();
        try {
            client = SshClientFactory.initSshClient(host, username, password);

            if (null != cmds) {
                result.setStatus(TaskStatus.DOING);
                StringBuilder sb = new StringBuilder();
                for (String cmd : cmds) {
                    sb.append(cmd).append(" && ");
                }
                sb.delete(sb.lastIndexOf(" && "), sb.length());
                Session session = client.startSession();
                String cmd = sb.toString();
                log.info(cmd);
                Command command = session.exec(cmd);
                while (command.getExitStatus() == null) {
                    try {
                        Thread.sleep(1000);
                    } catch (Exception ex) {
                        result.setError(ex.getMessage());
                        result.setStatus(TaskStatus.ERROR);
                        log.error(ex);
                    }
                }
                int ret = command.getExitStatus();
                System.out.println(ret);
                if (ret == 0) {
                    result.setStatus(TaskStatus.DONE);
                    String out = this.deserializeStream(command.getInputStream());
                    result.setOutput(out);
                } else {
                    result.setStatus(TaskStatus.ERROR);
                    String err = this.deserializeStream(command.getErrorStream());
                    String out = this.deserializeStream(command.getInputStream());
                    result.setError(err);
                    result.setOutput(out);
                }

            } else {
                result.setStatus(TaskStatus.DONE);
            }
            return result;
        } catch (Exception ex) {
            result.setStatus(TaskStatus.ERROR);
            result.setError(StackTraceUtil.getStackTrace(ex));
            log.error(ex);
            return result;
        } finally {
            try {
                client.close();
            } catch (Exception ex) {
                log.error(ex);
            }
        }
    }

    private String deserializeStream(InputStream stream) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int i = -1;
        while ((i = stream.read()) != -1) {
            baos.write(i);
        }
        String content = baos.toString();
        baos.close();
        return content;
    }

}
